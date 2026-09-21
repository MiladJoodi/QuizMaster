"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data";
import { generateId } from "@/lib/utils";

const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  difficulty: z.string().min(1, "Please select difficulty"),
  timeLimit: z.number().min(1).max(120),
  passingScore: z.number().min(1).max(100),
});

type QuizForm = z.infer<typeof quizSchema>;

interface QuestionDraft {
  id: string;
  text: string;
  type: "multiple-choice" | "true-false" | "multi-select";
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  points: number;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizForm>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      timeLimit: 15,
      passingScore: 60,
    },
  });

  const addQuestion = () => {
    const newQuestion: QuestionDraft = {
      id: generateId(),
      text: "",
      type: "multiple-choice",
      options: [
        { id: generateId(), text: "", isCorrect: true },
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
        { id: generateId(), text: "", isCorrect: false },
      ],
      explanation: "",
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<QuestionDraft>) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  };

  const setCorrectOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) => ({
                ...o,
                isCorrect: o.id === optionId,
              })),
            }
          : q
      )
    );
  };

  const onSubmit = (data: QuizForm) => {
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    const emptyQuestion = questions.find(
      (q) => !q.text || q.options.some((o) => !o.text)
    );
    if (emptyQuestion) {
      toast.error("Please fill in all question texts and options");
      return;
    }

    toast.success("Quiz created successfully!", {
      description: `"${data.title}" with ${questions.length} questions has been saved.`,
    });
    router.push("/quizzes");
  };

  return (
    <DashboardLayout pageTitle="Create Quiz">
      <>
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/quizzes")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter quiz title" {...register("title")} />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your quiz..."
                    rows={3}
                    {...register("description")}
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(val) => {
                    const event = { target: { name: "categoryId", value: val } };
                    register("categoryId").onChange(event as never);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select onValueChange={(val) => {
                    const event = { target: { name: "difficulty", value: val } };
                    register("difficulty").onChange(event as never);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.difficulty && <p className="text-xs text-destructive">{errors.difficulty.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min={1}
                    max={120}
                    {...register("timeLimit", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min={1}
                    max={100}
                    {...register("passingScore", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Questions ({questions.length})
              </CardTitle>
              <Button type="button" onClick={addQuestion} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground mb-4">No questions added yet</p>
                  <Button type="button" variant="outline" onClick={addQuestion}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question, qIndex) => (
                    <div key={question.id} className="rounded-lg border border-border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <Badge variant="outline">Question {qIndex + 1}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="Enter question text..."
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                        />
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setCorrectOption(question.id, option.id)}
                                className={`flex h-8 w-8 shrink-0 items-center justify-center border-2 transition-colors ${
                                  option.isCorrect
                                    ? "border-success bg-success text-success-foreground"
                                    : "border-border hover:border-primary/40"
                                }`}
                              >
                                {option.isCorrect && <CheckCircle2 className="h-4 w-4" />}
                              </button>
                              <Input
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                value={option.text}
                                onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </div>
                        <Input
                          placeholder="Explanation (optional)"
                          value={question.explanation}
                          onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/quizzes")}>
              Cancel
            </Button>
          </div>
        </form>
      </>
    </DashboardLayout>
  );
}
