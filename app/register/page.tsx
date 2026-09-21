"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    const success = registerUser(data.name, data.email, data.password);
    if (success) {
      toast.success("PLAYER CREATED — GO!");
      router.push("/dashboard");
    } else {
      toast.error("EMAIL ALREADY TAKEN");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div className="pointer-events-none absolute inset-0 hazard-stripe opacity-[0.06]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, #ff3d9a44, transparent 40%), radial-gradient(circle at 80% 80%, #b8ff3c33, transparent 40%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary font-display text-lg text-primary-foreground shadow-[3px_3px_0_0_var(--acid)]">
            Q
          </span>
          <div>
            <span className="block font-display text-xl text-primary">QUEZ</span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.22em] text-acid">
              <Zap className="h-2.5 w-2.5" /> Neon Rush
            </span>
          </div>
        </div>

        <h1 className="font-display text-3xl text-acid">NEW PLAYER</h1>
        <p className="mt-2 font-bold text-muted-foreground">
          Create your slot and start scoring
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold uppercase tracking-wider">
              Display name
            </Label>
            <Input id="name" placeholder="Neon Fox" {...register("name")} />
            {errors.name && (
              <p className="text-xs font-bold text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold uppercase tracking-wider">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="player@arena.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs font-bold text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pr-12"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-11 w-11"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs font-bold text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="font-bold uppercase tracking-wider"
            >
              Confirm
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="pr-12"
                {...register("confirmPassword")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-11 w-11"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-bold text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            <UserPlus className="mr-2 h-4 w-4" />
            Join
          </Button>
        </form>

        <p className="mt-8 text-center text-sm font-bold text-muted-foreground">
          Already in?{" "}
          <Link
            href="/login"
            className="cursor-pointer font-bold uppercase text-primary hover:text-acid"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
