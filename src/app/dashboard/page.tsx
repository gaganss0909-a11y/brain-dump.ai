"use client";

import { Header } from "@/components/header";
import { BrainDumpForm } from "@/components/braindump-form";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, Loader2 } from "lucide-react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type SubscriptionTier = "Free" | "Monthly" | "Yearly";

export default function DashboardPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionTier | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        setIsLoading(true);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubscription(data.subscriptionTier || "Free");
          setGenerationCount(data.generations || 0);
        } else {
          // Handle case where user doc might not exist yet
          setSubscription("Free");
          setGenerationCount(0);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleGeneration = () => {
    // This logic would now be handled via a server-side function
    // that increments the count in Firestore after a successful generation.
    // For now, we'll keep the client-side increment for visual feedback.
    setGenerationCount(prev => prev + 1);
  };

  if (!user) {
    return null; // Or a loading/redirect state
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </main>
      </div>
    );
  }

  const canGenerate = subscription !== 'Free' || generationCount < 1;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <BrainDumpForm onGenerate={handleGeneration} canGenerate={canGenerate} />

          {!canGenerate && (
             <Card className="mt-8 text-center bg-card">
                <CardHeader>
                    <CardTitle>You've used your free generation!</CardTitle>
                    <CardDescription>Upgrade to a paid plan for unlimited generations and more.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/pricing">
                            <Zap className="mr-2" />
                            Upgrade Plan
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
