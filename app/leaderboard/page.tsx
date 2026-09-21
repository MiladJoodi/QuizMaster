"use client";

import { TrendingUp, TrendingDown, Minus, Crown } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3.5 w-3.5 text-success" />;
      case "down":
        return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
      default:
        return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout pageTitle="Leaderboard">
      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        {topThree.map((entry) => {
          const place = entry.rank;
          const isYou = entry.userId === user?.id;
          return (
            <div
              key={entry.userId}
              className={cn(
                "relative overflow-hidden rounded-3xl border-2 p-5",
                place === 1
                  ? "border-gold/50 bg-gold/10 sm:order-2 sm:scale-105"
                  : "border-border bg-raised",
                place === 2 && "sm:order-1",
                place === 3 && "sm:order-3"
              )}
            >
              {place === 1 && (
                <Crown className="absolute right-4 top-4 h-6 w-6 text-gold" />
              )}
              <span
                className={cn(
                  "font-display text-5xl font-extrabold tracking-tighter",
                  place === 1 ? "text-gold" : "text-primary"
                )}
              >
                #{place}
              </span>
              <p className="mt-2 font-display text-xl font-extrabold">
                {entry.name}
                {isYou && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary-foreground">
                    You
                  </span>
                )}
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-primary">
                {entry.totalScore.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-muted-foreground">
                {entry.quizzesTaken} quizzes · {entry.averageScore}% avg
              </p>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-extrabold">Full board</h2>
        <div className="overflow-x-auto overflow-hidden rounded-3xl border-2 border-border bg-raised">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16 font-extrabold">Rank</TableHead>
                <TableHead className="font-extrabold">Player</TableHead>
                <TableHead className="text-right font-extrabold">Score</TableHead>
                <TableHead className="hidden text-right font-extrabold sm:table-cell">
                  Quizzes
                </TableHead>
                <TableHead className="hidden text-right font-extrabold md:table-cell">
                  Avg
                </TableHead>
                <TableHead className="w-12 text-center font-extrabold">Δ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry) => {
                const isYou = entry.userId === user?.id;
                return (
                  <TableRow
                    key={entry.userId}
                    className={cn(isYou && "bg-primary/10")}
                  >
                    <TableCell>
                      <span
                        className={cn(
                          "font-display text-sm font-extrabold",
                          entry.rank <= 3 ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {entry.rank}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-xl">
                          <AvatarFallback className="rounded-xl bg-inset text-[10px] font-extrabold">
                            {getInitials(entry.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-bold">{entry.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-display font-extrabold tabular-nums">
                      {entry.totalScore.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden text-right font-bold sm:table-cell">
                      {entry.quizzesTaken}
                    </TableCell>
                    <TableCell className="hidden text-right font-bold md:table-cell">
                      {entry.averageScore}%
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(entry.trend)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </DashboardLayout>
  );
}
