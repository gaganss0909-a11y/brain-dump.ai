
"use client";

import { Header } from "@/components/header";
import { BrainDumpForm } from "@/components/braindump-form";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, Loader2, ShieldCheck } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { manualUpgradeAction } from "./admin-actions";
import { useToast } from "@/hooks/use-toast";


type SubscriptionTier = "Free" | "Monthly" | "Yearly";

// This is a "secret" admin panel to allow testing of subscription features
// without a working Stripe webhook.
const DevAdminPanel = ({ onUpgrade }: { onUpgrade: () => void }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await manualUpgradeAction();
      toast({
        title: "Success!",
        description: "Account upgraded to Yearly plan for testing.",
      });
      onUpgrade();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Upgrade Failed",
        description: "Could not update subscription.",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Card className="mt-8 border-yellow-500/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-yellow-500" /> Dev Admin</CardTitle>
        <CardDescription>
          For testing purposes only. Use this button to simulate a successful
          payment and upgrade the account to the Yearly plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleUpgrade} disabled={isUpgrading}>
          {isUpgrading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Manually Upgrade to Yearly"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};


export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionTier | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Replace this with your actual Firebase User email to enable the admin panel.
  const ADMIN_EMAIL = "gagan.ss0909@gmail.com"; 
  
  const isUserAdmin = user?.email === ADMIN_EMAIL;


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
      }, (error) => {
        console.error("Error listening to user document:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch user data.",
        });
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [user, toast]);

  const handleGeneration = () => {
    // This logic is now handled via the `generatePlanAction` server-side function
    // which increments the count in Firestore after a successful generation.
    // We still update client-side state for immediate visual feedback.
    setGenerationCount(prev => prev + 1);
  };
  
  const forceRerender = () => {
    // A simple way to force a re-check of the subscription state
     if (user) {
      const userDocRef = doc(db, "users", user.uid);
      onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubscription(data.subscriptionTier || "Free");
        }
      });
    }
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

          {isUserAdmin && <DevAdminPanel onUpgrade={forceRerender} />}
        </div>
      </main>
    </div>
  );
}
