"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          Personal details and security preferences for your workspace user.
        </p>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Name</p>
            <p className="text-muted-foreground">{user?.username}</p>
          </div>
          <div>
            <p className="font-medium">Role</p>
            <p className="text-muted-foreground">
              Admin (mock data for demo purposes)
            </p>
          </div>
          <Button variant="outline" disabled>
            Update profile (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
