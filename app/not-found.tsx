"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <p className="font-display text-8xl font-extrabold tracking-tighter text-primary">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-extrabold">
          Lost in the arena
        </h1>
        <p className="mt-2 font-semibold text-muted-foreground">
          This page doesn&apos;t exist — or it got eliminated.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            <Zap className="mr-2 h-4 w-4" />
            Arena home
          </Button>
        </div>
      </div>
    </div>
  );
}
