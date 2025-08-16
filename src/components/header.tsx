"use client";

import Link from "next/link";
import { BrainIcon } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, UserPlus } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link href="/" className="flex items-center justify-center mr-auto" prefetch={false}>
        <BrainIcon className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">BrainDump.io</span>
      </Link>
      <nav className="flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden sm:inline-block">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut />
              <span className="sr-only">Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">
                <LogIn />
                <span className="hidden sm:inline-block ml-2">Login</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                <UserPlus />
                <span className="hidden sm:inline-block ml-2">Sign Up</span>
              </Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
