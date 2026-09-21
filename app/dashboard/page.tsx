"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Trophy,
  Sparkles,
  Zap,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/auth-store";
import {
  quizzes,
  quizAttempts,
  categories,
  achievements,
} from "@/lib/data";
import {
  formatDate,
  getDifficultyColor,
  formatDuration,
  cn,
} from "@/lib/utils";
import {
  chartAxisTick,
  chartGridProps,
  chartTooltipStyle,
} from "@/components/chart-theme";

const performanceData = [
  { month: "Sep", score: 65 },
  { month: "Oct", score: 72 },
  { month: "Nov", score: 68 },
  { month: "Dec", score: 78 },
  { month: "Jan", score: 82 },
  { month: "Feb", score: 85 },
  { month: "Mar", score: 88 },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const userAttempts = useMemo(() => {
    return quizAttempts.filter(
      (a) => a.userId === user?.id || a.userId === "user-1"
    );
  }, [user]);

  const recentAttempts = useMemo(() => {
    return [...userAttempts]
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
      .slice(0, 5);
  }, [userAttempts]);

  const recommended = useMemo(() => {
    return quizzes
      .filter((q) => q.status === "published")
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, []);

  const nextAchievement = achievements.find((a) => a.status === "in-progress");
  const streak = user?.stats?.streak ?? 0;

  return (
    <DashboardLayout pageTitle="LOBBY">
      <section className="neon-box relative mb-8 overflow-hidden rounded-xl bg-raised p-6 sm:p-8">
        <div className="absolute inset-0 opacity-[0.07] hazard-stripe" />
        <div className="absolute right-0 top-0 h-full w-2.5 hazard-stripe" />
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent), transparent 70%)",
          }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="skew-label mb-3 inline-block bg-acid px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              <Zap className="mr-1 inline h-3 w-3" />
              Neon Rush
            </p>
            <h2 className="font-display text-3xl leading-none text-primary sm:text-5xl">
              {user?.name?.split(" ")[0]?.toUpperCase() ?? "PLAYER"}
            </h2>
            <p className="mt-3 flex items-center gap-2 text-lg font-bold">
              <Flame className="h-6 w-6 text-signal drop-shadow-[0_0_8px_var(--signal)]" />
              <span className="font-display text-4xl text-signal drop-shadow-[0_0_12px_color-mix(in_srgb,var(--signal)_50%,transparent)]">
                {streak}
              </span>
              <span className="text-muted-foreground">DAY STREAK</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => router.push("/quizzes")}>
              <BookOpen className="mr-2 h-4 w-4" />
              Play
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push("/leaderboard")}
            >
              <Trophy className="mr-2 h-4 w-4" />
              Rank
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "AVG SCORE",
            value: `${user?.stats?.averageScore ?? 0}%`,
            color: "text-acid",
            shadow: "shadow-[4px_4px_0_0_var(--acid)]",
          },
          {
            label: "RANK",
            value: `#${user?.stats?.rank ?? "—"}`,
            color: "text-primary",
            shadow: "shadow-[4px_4px_0_0_var(--primary)]",
          },
          {
            label: "XP",
            value: (user?.stats?.totalPoints ?? 0).toLocaleString(),
            color: "text-spark",
            shadow: "shadow-[4px_4px_0_0_var(--spark)]",
          },
        ].map((m) => (
          <div
            key={m.label}
            className={cn(
              "rounded-xl border-[3px] border-border bg-raised p-5",
              m.shadow
            )}
          >
            <p className="text-meta">{m.label}</p>
            <p className={cn("mt-1 font-display text-4xl", m.color)}>{m.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <section>
          <h2 className="mb-3 font-display text-xl text-acid">SCORE CURVE</h2>
          <div className="rounded-xl border-[3px] border-border bg-raised p-4 shadow-[4px_4px_0_0_var(--spark)]">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="neonFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="month" tick={chartAxisTick} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={chartAxisTick} axisLine={false} tickLine={false} width={28} />
                  <RechartsTooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value: number | undefined) => [`${value ?? 0}%`, "Score"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    fill="url(#neonFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl text-primary">NEXT UNLOCK</h2>
          {nextAchievement ? (
            <div className="neon-lime rounded-xl bg-raised p-5">
              <p className="text-meta !text-primary">{nextAchievement.category}</p>
              <h3 className="mt-2 font-display text-lg text-acid">
                {nextAchievement.title}
              </h3>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {nextAchievement.description}
              </p>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">PROGRESS</span>
                  <span className="font-mono-score text-acid">
                    {nextAchievement.progress}/{nextAchievement.maxProgress}
                  </span>
                </div>
                <Progress
                  value={
                    (nextAchievement.progress / nextAchievement.maxProgress) * 100
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border-[3px] border-border bg-raised p-5">
              <Sparkles className="h-6 w-6 text-gold" />
              <p className="font-bold">All trophies unlocked. Keep rushing!</p>
            </div>
          )}
        </section>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl text-spark">RECENT RUNS</h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/results")}>
              History <ChevronRight className="ml-0.5 h-3 w-3" />
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border-[3px] border-border bg-raised">
            {recentAttempts.length === 0 && (
              <p className="px-4 py-10 text-center font-bold text-muted-foreground">
                No runs yet — hit PLAY!
              </p>
            )}
            {recentAttempts.map((attempt) => {
              const quiz = quizzes.find((q) => q.id === attempt.quizId);
              if (!quiz) return null;
              const category = categories.find((c) => c.id === quiz.categoryId);
              return (
                <button
                  key={attempt.id}
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-4 border-b-[3px] border-border px-4 py-4 text-left last:border-0 hover:bg-inset"
                  onClick={() =>
                    router.push(
                      `/quiz/${attempt.quizId}/results?attemptId=${attempt.id}`
                    )
                  }
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-[3px] font-display text-sm",
                      attempt.passed
                        ? "border-success bg-success/20 text-success"
                        : "border-destructive bg-destructive/20 text-destructive"
                    )}
                  >
                    {attempt.percentage}%
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold uppercase tracking-wide">
                      {quiz.title}
                    </p>
                    <p className="truncate text-xs font-semibold text-muted-foreground">
                      {category?.name} · {formatDate(attempt.completedAt)} ·{" "}
                      {formatDuration(attempt.timeTaken)}
                    </p>
                  </div>
                  <Badge variant={attempt.passed ? "success" : "destructive"}>
                    {attempt.passed ? "WIN" : "FAIL"}
                  </Badge>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl text-primary">UP NEXT</h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/quizzes")}>
              All <ChevronRight className="ml-0.5 h-3 w-3" />
            </Button>
          </div>
          <ul className="overflow-hidden rounded-xl border-[3px] border-border bg-raised">
            {recommended.map((quiz) => {
              const category = categories.find((c) => c.id === quiz.categoryId);
              return (
                <li key={quiz.id} className="border-b-[3px] border-border last:border-0">
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-start gap-3 px-4 py-4 text-left hover:bg-inset"
                    onClick={() => router.push(`/quiz/${quiz.id}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold uppercase">{quiz.title}</p>
                      <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                        {category?.name} · {quiz.totalQuestions}Q · {quiz.timeLimit}m
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md border-[2px] px-2 py-0.5 text-[10px] font-bold uppercase",
                        getDifficultyColor(quiz.difficulty)
                      )}
                    >
                      {quiz.difficulty}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </DashboardLayout>
  );
}
