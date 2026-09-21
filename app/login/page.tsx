"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, Zap, Skull } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    const success = login(data.email, data.password);
    if (success) {
      toast.success("ENTERING THE ARENA");
      router.push("/dashboard");
    } else {
      toast.error("ACCESS DENIED");
    }
  };

  const handleDemoLogin = () => {
    setValue("email", "admin@example.com");
    setValue("password", "admin123");
    const success = login("admin@example.com", "admin123");
    if (success) {
      toast.success("DEMO MODE — GO!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-[50%] flex-col justify-between overflow-hidden border-r-[3px] border-border p-10 lg:flex">
        <div className="absolute inset-0 hazard-stripe opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, #ff2d9588, transparent 45%), radial-gradient(circle at 80% 80%, #c8ff0044, transparent 40%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary font-display text-xl text-primary-foreground shadow-[4px_4px_0_0_var(--acid)]">
            Q
          </span>
          <div>
            <span className="block font-display text-2xl text-primary">QUEZ</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-acid">
              Neon Rush
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="skew-label mb-4 inline-block bg-acid px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">
            <Zap className="mr-1 inline h-3 w-3" />
            Arcade Mode
          </p>
          <h2 className="font-display text-4xl leading-[1.15] text-foreground xl:text-5xl">
            QUIZ
            <br />
            <span className="text-primary">HARDER.</span>
            <br />
            <span className="text-acid">SCORE</span>
            <br />
            LOUDER.
          </h2>
          <p className="mt-6 max-w-sm text-base font-bold text-muted-foreground">
            Timed rounds. Neon boards. Zero chill. This is not another SaaS
            dashboard.
          </p>
        </div>

        <p className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spark">
          <Skull className="h-3.5 w-3.5" /> Press start to continue
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-3xl text-primary">QUEZ</span>
            <p className="text-meta !text-acid">Neon Rush</p>
          </div>

          <h1 className="font-display text-3xl text-acid">INSERT COIN</h1>
          <p className="mt-2 font-bold text-muted-foreground">
            Sign in to start the round
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="player@arena.com"
                className="border-[3px] rounded-md h-12"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs font-bold text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="font-bold uppercase tracking-wider"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="cursor-pointer text-xs font-bold uppercase text-primary hover:text-acid"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="border-[3px] rounded-md h-12 pr-12"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-12 w-12"
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

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              <LogIn className="mr-2 h-4 w-4" />
              Start
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-[3px] flex-1 bg-border" />
            <span className="text-meta">OR</span>
            <div className="h-[3px] flex-1 bg-border" />
          </div>

          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={handleDemoLogin}
          >
            <Zap className="mr-2 h-4 w-4" />
            Demo player
          </Button>

          <p className="mt-8 text-center text-sm font-bold text-muted-foreground">
            New?{" "}
            <Link
              href="/register"
              className="cursor-pointer font-bold uppercase text-primary hover:text-acid"
            >
              Create player
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
