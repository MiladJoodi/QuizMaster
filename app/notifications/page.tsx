"use client";

import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Trophy,
  AlertCircle,
  Clock,
  Users,
  Check,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNotificationStore } from "@/store/notification-store";
import { cn, getRelativeTime } from "@/lib/utils";
import { NotificationType } from "@/lib/types";

const typeIcons: Record<NotificationType, React.ElementType> = {
  quiz: BookOpen,
  achievement: Trophy,
  system: AlertCircle,
  reminder: Clock,
  social: Users,
};

const typeColors: Record<NotificationType, string> = {
  quiz: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  achievement: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  system: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  reminder: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  social: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotificationStore();

  return (
    <DashboardLayout pageTitle="Notifications">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
      >
        {/* Header Actions */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notification List */}
        {notifications.length > 0 ? (
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {notifications.map((notification, index) => {
                const Icon = typeIcons[notification.type] ?? Bell;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03, ease: "easeOut" as const }}
                    className={cn(
                      "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                      !notification.isRead && "bg-primary/[0.02]"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      typeColors[notification.type]
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn(
                            "text-sm",
                            !notification.isRead ? "font-semibold" : "font-medium"
                          )}>
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up! We'll notify you when something happens."
          />
        )}
      </motion.div>
    </DashboardLayout>
  );
}
