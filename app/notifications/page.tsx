"use client";

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

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  return (
    <DashboardLayout pageTitle="Notifications">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} unread`
            : "You're all caught up"}
        </p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <ul className="divide-y divide-border border border-border bg-raised">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] ?? Bell;
            return (
              <li
                key={notification.id}
                className={cn(
                  "flex items-start gap-4 px-4 py-4",
                  !notification.isRead && "bg-accent/40"
                )}
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-inset text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm",
                        !notification.isRead ? "font-semibold" : "font-medium"
                      )}
                    >
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-meta">
                    {getRelativeTime(notification.createdAt)}
                    <span className="mx-1.5">·</span>
                    <span className="capitalize">{notification.type}</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="We'll notify you when something happens."
        />
      )}
    </DashboardLayout>
  );
}
