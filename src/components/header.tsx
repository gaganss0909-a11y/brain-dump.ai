
"use client";

import Link from "next/link";
import { BrainIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserPlus } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link href="/" className="flex items-center justify-center mr-auto" prefetch={false}>
        <BrainIcon className="h-8 w-8 text-primary" />
        <span className="ml-3 text-xl font-bold font-headline tracking-wider">BRAINDUMP</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Button variant="link" asChild>
          <Link href="/pricing">Pricing</Link>
        </Button>
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:inline-block">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
              <LogOut />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">
                Login
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">
                Create Account
              </Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
