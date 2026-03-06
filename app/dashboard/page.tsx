"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { quizzes, quizAttempts, categories, achievements, leaderboard } from "@/lib/data";
import { formatDate, getDifficultyColor, getInitials, formatDuration } from "@/lib/utils";

// Performance over time data
const performanceData = [
  { month: "Sep", score: 65 },
  { month: "Oct", score: 72 },
  { month: "Nov", score: 68 },
  { month: "Dec", score: 78 },
  { month: "Jan", score: 82 },
  { month: "Feb", score: 85 },
  { month: "Mar", score: 88 },
];

// Category performance data
const categoryPerformance = [
  { name: "Science", score: 82, fill: "var(--chart-1)" },
  { name: "Math", score: 75, fill: "var(--chart-2)" },
  { name: "Programming", score: 91, fill: "var(--chart-3)" },
  { name: "History", score: 68, fill: "var(--chart-4)" },
  { name: "Language", score: 79, fill: "var(--chart-5)" },
];

// Score distribution for pie chart
const scoreDistribution = [
  { name: "90-100%", value: 8, fill: "#10b981" },
  { name: "70-89%", value: 15, fill: "#3b82f6" },
  { name: "50-69%", value: 12, fill: "#f59e0b" },
  { name: "Below 50%", value: 5, fill: "#ef4444" },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const userAttempts = useMemo(() => {
    return quizAttempts.filter((a) => a.userId === user?.id || a.userId === "user-1");
  }, [user]);

  const recentAttempts = useMemo(() => {
    return [...userAttempts]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5);
  }, [userAttempts]);

  const unlockedAchievements = achievements.filter((a) => a.status === "unlocked");

  return (
    <DashboardLayout pageTitle="Dashboard">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
        className="mb-6"
      >
        <Card className="overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0] ?? "User"}!</h2>
                <p className="mt-1 text-muted-foreground">
                  You&apos;re on a {user?.stats?.streak ?? 0}-day streak! Keep it going.
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Button onClick={() => router.push("/quizzes")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Quizzes
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/leaderboard")}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Button>
                </div>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Flame className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* KPI Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Quizzes Taken"
          value={user?.stats?.quizzesTaken ?? 0}
          icon={BookOpen}
          change="+3 this week"
          changeType="positive"
          index={0}
        />
        <StatCard
          title="Average Score"
          value={`${user?.stats?.averageScore ?? 0}%`}
          icon={Target}
          change="+5% improvement"
          changeType="positive"
          index={1}
        />
        <StatCard
          title="Total Points"
          value={(user?.stats?.totalPoints ?? 0).toLocaleString()}
          icon={Star}
          change="+250 this week"
          changeType="positive"
          index={2}
        />
        <StatCard
          title="Global Rank"
          value={`#${user?.stats?.rank ?? "-"}`}
          icon={Trophy}
          change="Up 2 positions"
          changeType="positive"
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Performance Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
                    <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
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
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-primary" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={90} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number | undefined) => [`${value ?? 0}%`, "Score"]}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Quiz Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/results")}>
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttempts.map((attempt) => {
                  const quiz = quizzes.find((q) => q.id === attempt.quizId);
                  if (!quiz) return null;
                  const category = categories.find((c) => c.id === quiz.categoryId);
                  return (
                    <div
                      key={attempt.id}
                      className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {attempt.percentage}%
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm">{quiz.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{category?.name}</span>
                          <span>·</span>
                          <span>{formatDate(attempt.completedAt)}</span>
                          <span>·</span>
                          <span>{formatDuration(attempt.timeTaken)}</span>
                        </div>
                      </div>
                      <Badge
                        variant={attempt.passed ? "default" : "destructive"}
                        className="shrink-0"
                      >
                        {attempt.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  );
                })}
                {recentAttempts.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No quiz attempts yet. Start your first quiz!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Distribution + Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" as const }}
          className="space-y-6"
        >
          {/* Score Distribution Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {scoreDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Achievements</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/achievements")}>
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unlockedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{achievement.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
