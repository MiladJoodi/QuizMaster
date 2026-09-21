"use client";

import {
  Trophy,
  Award,
  Star,
  Zap,
  Flame,
  Target,
  BookOpen,
  Clock,
  Users,
  Crown,
  Lock,
  Medal,
  Brain,
  Rocket,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Metric } from "@/components/stat-card";
import { Progress } from "@/components/ui/progress";
import { achievements } from "@/lib/data";
import { cn, formatDate } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Award,
  Star,
  Zap,
  Flame,
  Target,
  BookOpen,
  Clock,
  Users,
  Crown,
  Medal,
  Brain,
  Rocket,
};

export default function AchievementsPage() {
  const unlocked = achievements.filter((a) => a.status === "unlocked");
  const inProgress = achievements.filter((a) => a.status === "in-progress");
  const locked = achievements.filter((a) => a.status === "locked");
  const totalPoints = unlocked.reduce((acc, a) => acc + a.points, 0);

  return (
    <DashboardLayout pageTitle="Achievements">
      <div className="mb-8 flex flex-wrap gap-x-10 gap-y-4 border-b border-border pb-6">
        <Metric
          label="Unlocked"
          value={`${unlocked.length}/${achievements.length}`}
        />
        <Metric label="Trophy XP" value={totalPoints} />
        <Metric label="In progress" value={inProgress.length} />
      </div>

      {unlocked.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-xl font-extrabold">
            Unlocked
          </h2>
          <ul className="divide-y-2 divide-border overflow-hidden rounded-3xl border-2 border-border bg-raised">
            {unlocked.map((achievement) => {
              const Icon = iconMap[achievement.icon] ?? Trophy;
              return (
                <li
                  key={achievement.id}
                  className="flex items-start gap-4 px-4 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p className="text-sm font-semibold">{achievement.title}</p>
                      <span className="font-mono-score text-xs text-muted-foreground">
                        +{achievement.points} pts
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <p className="mt-1 text-meta text-success">
                        Unlocked {formatDate(achievement.unlockedAt)}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {inProgress.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-xl font-extrabold">
            In progress
          </h2>
          <ul className="divide-y-2 divide-border overflow-hidden rounded-3xl border-2 border-border bg-raised">
            {inProgress.map((achievement) => {
              const Icon = iconMap[achievement.icon] ?? Trophy;
              const pct =
                (achievement.progress / achievement.maxProgress) * 100;
              return (
                <li
                  key={achievement.id}
                  className="flex items-start gap-4 px-4 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-inset text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold">{achievement.title}</p>
                      <span className="font-mono-score text-xs tabular-nums text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <Progress value={pct} className="mt-3" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-extrabold">Locked</h2>
          <ul className="divide-y-2 divide-border overflow-hidden rounded-3xl border-2 border-border bg-raised">
            {locked.map((achievement) => (
              <li
                key={achievement.id}
                className={cn("flex items-start gap-4 px-4 py-4 opacity-55")}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-inset">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-sm font-semibold">{achievement.title}</p>
                    <span className="font-mono-score text-xs text-muted-foreground">
                      {achievement.points} pts
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </DashboardLayout>
  );
}
