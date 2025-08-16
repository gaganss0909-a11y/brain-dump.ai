"use client";

import { Header } from "@/components/header";
import { BrainDumpForm } from "@/components/braindump-form";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

// TODO: Replace this with actual subscription status from your database
type SubscriptionTier = "Free" | "Monthly" | "Yearly";

export default function DashboardPage() {
  const { user } = useAuth();
  // Placeholder for subscription status. In a real app, you'd fetch this from your backend.
  const [subscription, setSubscription] = useState<SubscriptionTier>("Free");
  const [generationCount, setGenerationCount] = useState(0); // Placeholder for usage tracking

  const handleGeneration = () => {
    // In a real app, this would be updated after a successful generation
    setGenerationCount(prev => prev + 1);
  };

  if (!user) {
    return null;
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
