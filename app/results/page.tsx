"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  TrendingUp,
  ChevronRight,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
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
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function ResultsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");

  const userAttempts = useMemo(() => {
    return quizAttempts
      .filter((a) => a.userId === user?.id || a.userId === "user-1")
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
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
      userAttempts.reduce((acc, a) => acc + a.percentage, 0) / userAttempts.length
    );
  }, [userAttempts]);

  const passRate = useMemo(() => {
    if (userAttempts.length === 0) return 0;
    const passed = userAttempts.filter((a) => a.passed).length;
    return Math.round((passed / userAttempts.length) * 100);
  }, [userAttempts]);

  // Performance trend data
  const trendData = useMemo(() => {
    return [...userAttempts]
      .reverse()
      .map((attempt, index) => ({
        attempt: `#${index + 1}`,
        score: attempt.percentage,
      }));
  }, [userAttempts]);

  return (
    <DashboardLayout pageTitle="Results">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
      >
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Attempts"
            value={userAttempts.length}
            icon={ClipboardCheck}
            index={0}
          />
          <StatCard
            title="Average Score"
            value={`${averageScore}%`}
            icon={TrendingUp}
            index={1}
          />
          <StatCard
            title="Pass Rate"
            value={`${passRate}%`}
            icon={BarChart3}
            index={2}
          />
        </div>

        {/* Performance Trend */}
        {trendData.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="attempt" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number | undefined) => [`${value ?? 0}%`, "Score"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        fill="url(#trendGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by quiz name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Results Table */}
        <Card>
          <CardContent className="p-0">
            {filteredAttempts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Taken</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
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
                      <TableRow key={attempt.id}>
                        <TableCell className="font-medium">
                          {quiz?.title ?? "Unknown Quiz"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {category?.name ?? "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("font-semibold", grade.color)}>
                            {attempt.percentage}% ({grade.grade})
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={attempt.passed ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {attempt.passed ? "Passed" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDuration(attempt.timeTaken)}</TableCell>
                        <TableCell>{formatDate(attempt.completedAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/quiz/${attempt.quizId}/results?attemptId=${attempt.id}`)
                            }
                          >
                            View
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8">
                <EmptyState
                  icon={ClipboardCheck}
                  title="No results yet"
                  description="Complete your first quiz to see your results here."
                  action={{
                    label: "Browse Quizzes",
                    onClick: () => router.push("/quizzes"),
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
