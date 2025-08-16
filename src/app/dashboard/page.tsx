"use client";

import { Header } from "@/components/header";
import { BrainDumpForm } from "@/components/braindump-form";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">Let's build your next big idea.</h1>
            <p className="text-muted-foreground mt-2">
              Fill out the details below and let our AI create a development plan for you.
            </p>
          </div>
          <BrainDumpForm />
        </div>
      </main>
    </div>
  );
}
