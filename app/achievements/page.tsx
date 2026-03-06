"use client";

import { motion } from "framer-motion";
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
  CheckCircle2,
  Medal,
  Brain,
  Rocket,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
      >
        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unlocked.length}/{achievements.length}</p>
                <p className="text-xs text-muted-foreground">Unlocked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Achievement Points</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgress.length}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Unlocked ({unlocked.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unlocked.map((achievement, index) => {
                const Icon = iconMap[achievement.icon] ?? Trophy;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" as const }}
                  >
                    <Card className="border-emerald-200 dark:border-emerald-800">
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                          <Icon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">{achievement.title}</p>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {achievement.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {achievement.description}
                          </p>
                          {achievement.unlockedAt && (
                            <p className="text-[10px] text-emerald-500 mt-1">
                              Unlocked {formatDate(achievement.unlockedAt)}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgress.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              In Progress ({inProgress.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map((achievement, index) => {
                const Icon = iconMap[achievement.icon] ?? Trophy;
                const progressPct = (achievement.progress / achievement.maxProgress) * 100;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" as const }}
                  >
                    <Card>
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                          <Icon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">{achievement.title}</p>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {achievement.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {achievement.description}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                              <span>{Math.round(progressPct)}%</span>
                            </div>
                            <Progress value={progressPct} className="h-1.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Locked ({locked.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {locked.map((achievement, index) => {
                const Icon = iconMap[achievement.icon] ?? Trophy;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" as const }}
                  >
                    <Card className="opacity-60">
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">{achievement.title}</p>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {achievement.points} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {achievement.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
