"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/auth-store";
import { leaderboard } from "@/lib/data";
import { getInitials, cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const user = useAuthStore((state) => state.user);

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <Crown className="h-5 w-5 text-yellow-500" />
          </div>
        );
      case 2:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Medal className="h-5 w-5 text-slate-400" />
          </div>
        );
      case 3:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Medal className="h-5 w-5 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
            {rank}
          </div>
        );
    }
  };

  return (
    <DashboardLayout pageTitle="Leaderboard">
      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
        className="mb-8"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Second place */}
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" as const }}
              className="order-1 sm:order-none"
            >
              <Card className={cn(
                "text-center",
                topThree[1].userId === user?.id && "ring-2 ring-primary"
              )}>
                <CardContent className="pt-6">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <span className="text-xl font-bold text-slate-500">2</span>
                  </div>
                  <Avatar className="mx-auto mb-2 h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(topThree[1].name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{topThree[1].name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {topThree[1].totalScore.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topThree[1].quizzesTaken} quizzes · {topThree[1].averageScore}% avg
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* First place */}
          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" as const }}
              className="order-first sm:order-none"
            >
              <Card className={cn(
                "text-center border-yellow-300 dark:border-yellow-700",
                topThree[0].userId === user?.id && "ring-2 ring-primary"
              )}>
                <CardContent className="pt-6">
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <Crown className="h-10 w-10 text-yellow-500" />
                  </div>
                  <Avatar className="mx-auto mb-2 h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-lg text-primary">
                      {getInitials(topThree[0].name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-bold">{topThree[0].name}</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    {topThree[0].totalScore.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topThree[0].quizzesTaken} quizzes · {topThree[0].averageScore}% avg
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Third place */}
          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" as const }}
              className="order-2 sm:order-none"
            >
              <Card className={cn(
                "text-center",
                topThree[2].userId === user?.id && "ring-2 ring-primary"
              )}>
                <CardContent className="pt-6">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <span className="text-xl font-bold text-amber-600">3</span>
                  </div>
                  <Avatar className="mx-auto mb-2 h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(topThree[2].name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{topThree[2].name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {topThree[2].totalScore.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topThree[2].quizzesTaken} quizzes · {topThree[2].averageScore}% avg
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Full Rankings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" as const }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-primary" />
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Quizzes</TableHead>
                  <TableHead className="text-right">Avg Score</TableHead>
                  <TableHead className="w-[60px]">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow
                    key={entry.userId}
                    className={cn(
                      entry.userId === user?.id && "bg-primary/5"
                    )}
                  >
                    <TableCell>{getRankBadge(entry.rank)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {getInitials(entry.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{entry.name}</p>
                          {entry.userId === user?.id && (
                            <Badge variant="outline" className="text-[10px]">You</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {entry.totalScore.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{entry.quizzesTaken}</TableCell>
                    <TableCell className="text-right">{entry.averageScore}%</TableCell>
                    <TableCell>{getTrendIcon(entry.trend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
