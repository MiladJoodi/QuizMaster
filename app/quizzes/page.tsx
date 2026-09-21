"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { QuizCard } from "@/components/quiz-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quizzes, categories } from "@/lib/data";

export default function QuizzesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredQuizzes = useMemo(() => {
    let result = quizzes.filter((q) => q.status === "published");

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(searchLower) ||
          q.description.toLowerCase().includes(searchLower) ||
          q.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((q) => q.categoryId === selectedCategory);
    }

    if (selectedDifficulty !== "all") {
      result = result.filter((q) => q.difficulty === selectedDifficulty);
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.attempts - a.attempts);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "shortest":
        result.sort((a, b) => a.timeLimit - b.timeLimit);
        break;
    }

    return result;
  }, [search, selectedCategory, selectedDifficulty, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSortBy("popular");
  };

  const hasFilters =
    search || selectedCategory !== "all" || selectedDifficulty !== "all";

  return (
    <DashboardLayout pageTitle="Browse Quizzes">
      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search quizzes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="shortest">Shortest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters && (
        <div className="mb-4 flex items-center gap-2">
          <span className="font-mono-score text-sm text-muted-foreground">
            {filteredQuizzes.length} results
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      {filteredQuizzes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              category={categories.find((c) => c.id === quiz.categoryId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No quizzes found"
          description="Try adjusting your search or filters."
          action={{ label: "Clear filters", onClick: clearFilters }}
        />
      )}
    </DashboardLayout>
  );
}
