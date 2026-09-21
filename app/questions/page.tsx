"use client";

import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Database,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { EmptyState } from "@/components/empty-state";
import { Metric } from "@/components/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { questions, categories, quizzes } from "@/lib/data";
import { cn, getDifficultyColor, truncate } from "@/lib/utils";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState<(typeof questions)[number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((q) =>
        q.text.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((q) => q.categoryId === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      result = result.filter((q) => q.difficulty === selectedDifficulty);
    }

    if (selectedType !== "all") {
      result = result.filter((q) => q.type === selectedType);
    }

    return result;
  }, [search, selectedCategory, selectedDifficulty, selectedType]);

  const totalPages = Math.ceil(filteredQuestions.length / perPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const getQuizTitle = (quizId: string) => {
    return quizzes.find((q) => q.id === quizId)?.title ?? "Unknown Quiz";
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name ?? "Unknown";
  };

  return (
    <DashboardLayout pageTitle="Question Bank">
      <>
        <div className="mb-6 flex flex-wrap gap-x-10 gap-y-4 border-b border-border pb-6">
          <Metric label="Total" value={questions.length} />
          <Metric
            label="Multiple choice"
            value={questions.filter((q) => q.type === "multiple-choice").length}
          />
          <Metric
            label="True / false"
            value={questions.filter((q) => q.type === "true-false").length}
          />
          <Metric
            label="Multi select"
            value={questions.filter((q) => q.type === "multi-select").length}
          />
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={(v) => { setSelectedDifficulty(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="multi-select">Multi Select</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border border-border bg-raised">
            {paginatedQuestions.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Question</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedQuestions.map((question) => (
                      <TableRow
                        key={question.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        <TableCell className="font-medium">
                          {truncate(question.text, 80)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(question.categoryId)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {question.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-xs", getDifficultyColor(question.difficulty))}>
                            {question.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{question.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredQuestions.length)} of {filteredQuestions.length}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8">
                <EmptyState
                  icon={Database}
                  title="No questions found"
                  description="Try adjusting your search or filters."
                />
              </div>
            )}
        </div>

        {/* Question Detail Dialog */}
        <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Question Details</DialogTitle>
              <DialogDescription>
                {selectedQuestion && getCategoryName(selectedQuestion.categoryId)} · {selectedQuestion?.type} · {selectedQuestion?.difficulty}
              </DialogDescription>
            </DialogHeader>
            {selectedQuestion && (
              <div className="space-y-4">
                <p className="text-sm font-medium">{selectedQuestion.text}</p>
                <div className="space-y-2">
                  {selectedQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center gap-2 border p-3 text-sm",
                        option.isCorrect && "border-success bg-success/10"
                      )}
                    >
                      {option.isCorrect && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      )}
                      <span>{option.text}</span>
                    </div>
                  ))}
                </div>
                {selectedQuestion.explanation && (
                  <div className="border-l-2 border-primary pl-3 text-sm">
                    <p className="text-meta mb-1">Explanation</p>
                    <p className="text-muted-foreground">{selectedQuestion.explanation}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Badge variant="outline">Quiz: {getQuizTitle(selectedQuestion.quizId)}</Badge>
                  <Badge variant="outline">{selectedQuestion.points} points</Badge>
                  {selectedQuestion.timeLimit && (
                    <Badge variant="outline">{selectedQuestion.timeLimit}s time limit</Badge>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    </DashboardLayout>
  );
}
