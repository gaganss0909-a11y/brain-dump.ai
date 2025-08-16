"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { generatePlanAction } from "@/app/dashboard/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  appIdea: z.string().min(20, {
    message: "Your app idea must be at least 20 characters to generate a meaningful plan.",
  }),
  appType: z.enum(["Web App", "Mobile App"], {
    required_error: "You need to select an app type.",
  }),
  buildTool: z.enum(["Windsurf", "Bolt.new", "Lovable"], {
    required_error: "You need to select a build tool.",
  }),
});

interface BrainDumpFormProps {
  canGenerate: boolean;
  onGenerate: () => void;
}


export function BrainDumpForm({ canGenerate, onGenerate }: BrainDumpFormProps) {
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appIdea: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!canGenerate) {
       toast({
        variant: "destructive",
        title: "Generation Limit Reached",
        description: "Please upgrade to a paid plan to generate more plans.",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedMarkdown(null);
    const result = await generatePlanAction(values);
    setIsLoading(false);

    if (result.success) {
      setGeneratedMarkdown(result.data!);
      onGenerate(); // Notify parent component that a generation occurred
    } else {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
    }
  }

  const handleDownload = () => {
    if (!generatedMarkdown) return;
    const blob = new Blob([generatedMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "braindump_plan.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="md:sticky top-8">
        <CardHeader>
          <CardTitle>Describe Your Vision</CardTitle>
          <CardDescription>The more detail you provide, the better the plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="appIdea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your App Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., An app that helps users track their plant watering schedules with reminders and plant care tips."
                        className="min-h-[150px]"
                        {...field}
                        disabled={!canGenerate || isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>App Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={!canGenerate || isLoading}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Web App" />
                          </FormControl>
                          <FormLabel className="font-normal">Web App</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Mobile App" />
                          </FormControl>
                          <FormLabel className="font-normal">Mobile App</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buildTool"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Build Tool</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={!canGenerate || isLoading}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Windsurf" />
                          </FormControl>
                          <FormLabel className="font-normal">Windsurf</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Bolt.new" />
                          </FormControl>
                          <FormLabel className="font-normal">Bolt.new</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Lovable" />
                          </FormControl>
                          <FormLabel className="font-normal">Lovable</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!canGenerate || isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <Card className="min-h-[500px]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Generated Plan</CardTitle>
                <CardDescription>Here's the AI-generated roadmap for your app.</CardDescription>
              </div>
              {generatedMarkdown && (
                <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Download plan">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <br />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                 <br />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            )}
            {generatedMarkdown ? (
              <pre className="whitespace-pre-wrap font-sans text-sm p-4 bg-muted/50 rounded-md overflow-x-auto">
                {generatedMarkdown}
              </pre>
            ) : (
              !isLoading && (
                <div className="text-center text-muted-foreground py-16">
                  <Wand2 className="mx-auto h-12 w-12 mb-4" />
                  <p>Your plan will appear here once generated.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
