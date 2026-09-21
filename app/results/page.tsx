"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, ClipboardCheck } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Metric } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth-store";
import { quizAttempts, quizzes, categories } from "@/lib/data";
import { formatDate, formatDuration, getGrade, cn } from "@/lib/utils";
import {
  chartAxisTick,
  chartGridProps,
  chartTooltipStyle,
} from "@/components/chart-theme";

export default function ResultsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");

  const userAttempts = useMemo(() => {
    return quizAttempts
      .filter((a) => a.userId === user?.id || a.userId === "user-1")
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
  }, [user]);

  const filteredAttempts = useMemo(() => {
    if (!search) return userAttempts;
    const searchLower = search.toLowerCase();
    return userAttempts.filter((attempt) => {
      const quiz = quizzes.find((q) => q.id === attempt.quizId);
      return quiz?.title.toLowerCase().includes(searchLower);
    });
  }, [userAttempts, search]);

  const averageScore = useMemo(() => {
    if (userAttempts.length === 0) return 0;
    return Math.round(
      userAttempts.reduce((acc, a) => acc + a.percentage, 0) /
        userAttempts.length
    );
  }, [userAttempts]);

  const passRate = useMemo(() => {
    if (userAttempts.length === 0) return 0;
    const passed = userAttempts.filter((a) => a.passed).length;
    return Math.round((passed / userAttempts.length) * 100);
  }, [userAttempts]);

  const trendData = useMemo(() => {
    return [...userAttempts].reverse().map((attempt, index) => ({
      attempt: `${index + 1}`,
      score: attempt.percentage,
    }));
  }, [userAttempts]);

  return (
    <DashboardLayout pageTitle="Results">
      <div className="mb-8 flex flex-wrap items-end gap-8 border-b border-border pb-6">
        <Metric label="Attempts" value={userAttempts.length} />
        <Metric label="Average score" value={`${averageScore}%`} />
        <Metric label="Pass rate" value={`${passRate}%`} />
      </div>

      {trendData.length > 1 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-lg font-medium">
            Performance trend
          </h2>
          <div className="border border-border bg-raised p-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="attempt" tick={chartAxisTick} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tick={chartAxisTick}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <RechartsTooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value: number | undefined) => [
                      `${value ?? 0}%`,
                      "Score",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#trendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by quiz name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-hidden border border-border bg-raised">
        {filteredAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Quiz</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Time</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((attempt) => {
                  const quiz = quizzes.find((q) => q.id === attempt.quizId);
                  const category = quiz
                    ? categories.find((c) => c.id === quiz.categoryId)
                    : null;
                  const grade = getGrade(attempt.percentage);

                  return (
                    <TableRow
                      key={attempt.id}
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/quiz/${attempt.quizId}/results?attemptId=${attempt.id}`
                        )
                      }
                    >
                      <TableCell className="font-medium">
                        {quiz?.title ?? "Unknown"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {category?.name ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-mono-score font-semibold",
                            grade.color
                          )}
                        >
                          {attempt.percentage}%
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          {grade.grade}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={attempt.passed ? "success" : "destructive"}
                        >
                          {attempt.passed ? "Passed" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden font-mono-score text-sm md:table-cell">
                        {formatDuration(attempt.timeTaken)}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {formatDate(attempt.completedAt)}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={ClipboardCheck}
              title="No results yet"
              description="Complete your first quiz to see your results here."
              action={{
                label: "Browse quizzes",
                onClick: () => router.push("/quizzes"),
              }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
