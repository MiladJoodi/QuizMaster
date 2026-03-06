"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Microscope,
  Calculator,
  Code,
  BookOpen,
  Languages,
  Globe,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { categories, quizzes } from "@/lib/data";
import { cn } from "@/lib/utils";

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon] ?? Globe;
          const categoryQuizzes = quizzes.filter(
            (q) => q.categoryId === category.id && q.status === "published"
          );
          const totalQuestions = categoryQuizzes.reduce(
            (acc, q) => acc + q.totalQuestions,
            0
          );

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut" as const,
              }}
            >
              <Card
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
                onClick={() => router.push(`/quizzes?category=${category.id}`)}
              >
                <div className={cn("h-1.5", category.color)} />
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        category.color,
                        "bg-opacity-10"
                      )}
                    >
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {categoryQuizzes.length} quizzes
                    </Badge>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{totalQuestions} questions</span>
                    <span>·</span>
                    <span>
                      {categoryQuizzes.reduce((acc, q) => acc + q.attempts, 0).toLocaleString()} attempts
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
