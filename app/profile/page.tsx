"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  BookOpen,
  Trophy,
  Target,
  Star,
  Flame,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    toast.success("Profile updated successfully!");
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
      >
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user?.name ?? "User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge variant="outline" className="capitalize">{user?.role}</Badge>
                  <Badge variant="secondary">
                    <Flame className="mr-1 h-3 w-3" />
                    {user?.stats?.streak ?? 0} day streak
                  </Badge>
                </div>
                {user?.bio && (
                  <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>
                )}
              </div>
              <Button
                variant={isEditing ? "ghost" : "outline"}
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Quizzes Taken"
            value={user?.stats?.quizzesTaken ?? 0}
            icon={BookOpen}
            index={0}
          />
          <StatCard
            title="Average Score"
            value={`${user?.stats?.averageScore ?? 0}%`}
            icon={Target}
            index={1}
          />
          <StatCard
            title="Total Points"
            value={(user?.stats?.totalPoints ?? 0).toLocaleString()}
            icon={Star}
            index={2}
          />
          <StatCard
            title="Global Rank"
            value={`#${user?.stats?.rank ?? "-"}`}
            icon={Trophy}
            index={3}
          />
        </div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="name" className="pl-9" {...register("name")} />
                      </div>
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="email" className="pl-9" {...register("email")} />
                      </div>
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      rows={3}
                      {...register("bio")}
                    />
                    {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
                  </div>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Account Info */}
        {!isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="font-medium">{user ? formatDate(user.createdAt) : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last login</p>
                  <p className="font-medium">{user ? formatDate(user.lastLogin) : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Category</p>
                  <p className="font-medium">{user?.stats?.bestCategory || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">{user?.status ?? "active"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
