"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/auth-context";

const PRESET_USERS = ["Alex Morgan", "Taylor Chen", "Jordan Patel"];

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) {
      setError("Enter a username to continue.");
      return;
    }

    login(trimmed);
    setError(null);
    router.replace("/dashboard");
  };

  const handlePresetSelect = (value: string) => {
    login(value);
    router.replace("/dashboard");
  };

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Sign in to Atlas Demo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Use any username to explore the workspace. We also provide a few
            ready-made personas to get started quickly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="e.g. Jordan Patel"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="off"
              />
              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              Continue
            </Button>
          </form>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Quick personas
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {PRESET_USERS.map((preset) => (
                <Button
                  key={preset}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => handlePresetSelect(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
