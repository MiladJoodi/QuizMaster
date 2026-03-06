"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getDifficultyColor } from "@/lib/utils";
import { Quiz, QuizCategory } from "@/lib/types";

interface QuizCardProps {
  quiz: Quiz;
  category?: QuizCategory;
  index?: number;
}

export function QuizCard({ quiz, category, index = 0 }: QuizCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" as const }}
    >
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
        {/* Color bar at top */}
        <div className={cn("h-1.5", category?.color ?? "bg-primary")} />
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between">
            <Badge variant="outline" className="text-xs">{category?.name ?? "General"}</Badge>
            <Badge className={cn("text-xs", getDifficultyColor(quiz.difficulty))}>{quiz.difficulty}</Badge>
          </div>
          <h3 className="mb-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {quiz.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {quiz.totalQuestions} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {quiz.timeLimit} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {quiz.attempts} attempts
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              {quiz.rating}
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border px-5 py-3">
          <Button className="w-full" onClick={() => router.push(`/quiz/${quiz.id}`)}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
