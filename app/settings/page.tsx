"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Palette,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    quizReminders: true,
    scoreAlerts: true,
    achievements: true,
    newsletter: false,
    sound: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Settings updated");
  };

  return (
    <DashboardLayout pageTitle="Settings">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <SettingsIcon className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="divide-y divide-border border border-border bg-raised">
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="space-y-0.5">
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">
                  Preferred interface language
                </p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="space-y-0.5">
                <Label>Timezone</Label>
                <p className="text-sm text-muted-foreground">Your current timezone</p>
              </div>
              <Select defaultValue="utc">
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern (EST)</SelectItem>
                  <SelectItem value="pst">Pacific (PST)</SelectItem>
                  <SelectItem value="cet">Central Europe (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="divide-y divide-border border border-border bg-raised">
            {(
              [
                ["quizReminders", "Quiz reminders", "Get reminded about unfinished quizzes"],
                ["scoreAlerts", "Score alerts", "Notify when results are ready"],
                ["achievements", "Achievements", "Celebrate unlocked milestones"],
                ["newsletter", "Newsletter", "Occasional product updates"],
                ["sound", "Sound effects", "Play audio feedback in quizzes"],
              ] as const
            ).map(([key, title, desc]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="space-y-0.5">
                  <Label>{title}</Label>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={notifications[key]}
                  onCheckedChange={() => handleNotificationChange(key)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="border border-border bg-raised p-5">
            <Label className="mb-3 block">Theme</Label>
            <p className="mb-4 text-sm text-muted-foreground">
              Choose light, dark, or follow your system preference.
            </p>
            <div className="flex flex-wrap gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? "default" : "outline"}
                  size="sm"
                  className="capitalize"
                  onClick={() => {
                    setTheme(t);
                    toast.success(`Theme set to ${t}`);
                  }}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
