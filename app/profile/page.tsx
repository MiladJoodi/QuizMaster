"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit2, Save, X, Flame } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Metric } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { getInitials, formatDate } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  bio: z.string().max(200, "Bio must be 200 characters or less"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfile(data);
    setIsEditing(false);
    toast.success("Profile updated");
  };

  const handleCancel = () => {
    reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout pageTitle="Profile">
      <section className="mb-8 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-md">
            <AvatarFallback className="rounded-md bg-primary/10 font-display text-xl font-medium text-primary">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display text-2xl font-medium">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {user?.role}
              </Badge>
              <span className="inline-flex items-center gap-1 text-sm text-signal">
                <Flame className="h-3.5 w-3.5" />
                <span className="font-mono-score font-semibold">
                  {user?.stats?.streak ?? 0}
                </span>
                -day streak
              </span>
            </div>
            {user?.bio && !isEditing && (
              <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <Button
          variant={isEditing ? "ghost" : "outline"}
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </section>

      <div className="mb-8 flex flex-wrap gap-x-10 gap-y-4">
        <Metric label="Quizzes taken" value={user?.stats?.quizzesTaken ?? 0} />
        <Metric
          label="Average score"
          value={`${user?.stats?.averageScore ?? 0}%`}
        />
        <Metric
          label="Points"
          value={(user?.stats?.totalPoints ?? 0).toLocaleString()}
        />
        <Metric label="Rank" value={`#${user?.stats?.rank ?? "—"}`} />
      </div>

      {isEditing && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 space-y-4 border border-border bg-raised p-5"
        >
          <h3 className="font-display text-lg font-medium">Edit profile</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} {...register("bio")} />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save changes
          </Button>
        </form>
      )}

      {!isEditing && (
        <section className="border border-border bg-raised p-5">
          <h3 className="mb-4 font-display text-lg font-medium">
            Account information
          </h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-meta">Member since</dt>
              <dd className="mt-1 text-sm font-medium">
                {user ? formatDate(user.createdAt) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-meta">Last login</dt>
              <dd className="mt-1 text-sm font-medium">
                {user ? formatDate(user.lastLogin) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-meta">Best category</dt>
              <dd className="mt-1 text-sm font-medium">
                {user?.stats?.bestCategory || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-meta">Status</dt>
              <dd className="mt-1">
                <Badge variant="outline" className="capitalize">
                  {user?.status ?? "active"}
                </Badge>
              </dd>
            </div>
          </dl>
        </section>
      )}
    </DashboardLayout>
  );
}
