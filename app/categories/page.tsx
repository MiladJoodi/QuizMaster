"use client";

import { useRouter } from "next/navigation";
import {
  Microscope,
  Calculator,
  Code,
  BookOpen,
  Languages,
  Globe,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { categories, quizzes } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Microscope,
  Calculator,
  Code,
  BookOpen,
  Languages,
  Globe,
};

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <DashboardLayout pageTitle="Categories">
      <ul className="divide-y divide-border border border-border bg-raised">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] ?? Globe;
          const categoryQuizzes = quizzes.filter(
            (q) => q.categoryId === category.id && q.status === "published"
          );
          const totalQuestions = categoryQuizzes.reduce(
            (acc, q) => acc + q.totalQuestions,
            0
          );

          return (
            <li key={category.id}>
              <button
                type="button"
                className="flex w-full items-start gap-4 px-4 py-5 text-left transition-colors hover:bg-inset/50 sm:px-5"
                onClick={() =>
                  router.push(`/quizzes?category=${category.id}`)
                }
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-inset text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-medium">
                      {category.name}
                    </h3>
                    <span className="font-mono-score text-xs text-muted-foreground">
                      {categoryQuizzes.length} quizzes · {totalQuestions}{" "}
                      questions
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </DashboardLayout>
  );
}
