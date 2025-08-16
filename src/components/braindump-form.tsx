"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { generatePlanAction } from "@/app/dashboard/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Loader2, Wand2, ArrowLeft, ArrowRight, Smartphone, Globe } from "lucide-react";

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

const stepHeaders = [
  { title: "Describe Your Vision", description: "The more detail you provide, the better the plan." },
  { title: "App Type", description: "Choose the type of application you want to develop." },
  { title: "Build Tool", description: "Select your preferred tool for building the application." },
  { title: "Your Generated Plan", description: "Here's the AI-generated roadmap for your app." },
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    };
  }
};

export function BrainDumpForm({ canGenerate, onGenerate }: BrainDumpFormProps) {
  const [[currentStep, direction], setCurrentStep] = useState([0, 0]);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appIdea: "",
    },
  });

  const { trigger, getValues } = form;

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await trigger("appIdea");
    } else if (currentStep === 1) {
      isValid = await trigger("appType");
    }

    if (isValid) {
      setCurrentStep(state => [state[0] + 1, 1]);
    }
  };

  const handleBack = () => {
    setCurrentStep(state => [state[0] - 1, -1]);
  };

  const handleStartOver = () => {
    form.reset();
    setGeneratedMarkdown(null);
    setCurrentStep([0, -1]);
  }

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
    setCurrentStep([3, 1]); // Move to the results view
    const result = await generatePlanAction(values);
    setIsLoading(false);

    if (result.success) {
      setGeneratedMarkdown(result.data!);
      onGenerate();
    } else {
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: result.error,
      });
      setCurrentStep([2, -1]); // Go back to the last step on error
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{stepHeaders[currentStep].title}</CardTitle>
        <CardDescription>{stepHeaders[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden min-h-[350px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between h-full min-h-[350px]">
              <div className="relative h-full flex-grow">
                <AnimatePresence initial={false} custom={direction}>
                  {currentStep === 0 && (
                    <motion.div
                      key={0}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute w-full h-full"
                    >
                    <FormField
                      control={form.control}
                      name="appIdea"
                      render={({ field }) => (
                        <FormItem className="h-full flex flex-col">
                          <FormControl className="flex-grow">
                            <Textarea
                              placeholder="e.g., An app that helps users track their plant watering schedules with reminders and plant care tips."
                              className="min-h-[200px] h-full bg-background"
                              {...field}
                              disabled={!canGenerate || isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </motion.div>
                  )}

                  {currentStep === 1 && (
                    <motion.div
                      key={1}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute w-full"
                    >
                    <FormField
                      control={form.control}
                      name="appType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(["Mobile App", "Web App"] as const).map((type) => (
                                <Card
                                  key={type}
                                  onClick={() => form.setValue("appType", type, { shouldValidate: true })}
                                  className={cn(
                                    "cursor-pointer transition-all hover:shadow-lg",
                                    form.watch("appType") === type
                                      ? "border-accent ring-2 ring-accent"
                                      : "border-border"
                                  )}
                                >
                                  <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                                    {type === 'Mobile App' ? <Smartphone className="h-10 w-10 text-accent" /> : <Globe className="h-10 w-10 text-accent" />}
                                    <h3 className="font-bold text-lg">{type}</h3>
                                    <p className="text-muted-foreground text-sm">{type === 'Mobile App' ? 'iOS and Android' : 'Browser-based'}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage className="text-center pt-2" />
                        </FormItem>
                      )}
                    />
                    </motion.div>
                  )}
                  
                  {currentStep === 2 && (
                    <motion.div
                      key={2}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute w-full"
                    >
                    <FormField
                      control={form.control}
                      name="buildTool"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {(["Windsurf", "Bolt.new", "Lovable"] as const).map((tool) => (
                                <Card
                                  key={tool}
                                  onClick={() => form.setValue("buildTool", tool, { shouldValidate: true })}
                                  className={cn(
                                    "cursor-pointer transition-all hover:shadow-lg",
                                    form.watch("buildTool") === tool
                                      ? "border-accent ring-2 ring-accent"
                                      : "border-border"
                                  )}
                                >
                                  <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                                    <h3 className="font-bold text-lg">{tool}</h3>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage className="text-center pt-2" />
                        </FormItem>
                      )}
                    />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key={3}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute w-full h-full"
                    >
                    <div className="h-[250px] overflow-y-auto">
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
                        <>
                        <div className="flex justify-end mb-4 pr-4">
                          <Button variant="outline" size="sm" onClick={handleDownload} aria-label="Download plan">
                            <Download className="mr-2" /> Download
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-sm p-4 bg-muted/30 rounded-md">
                          {generatedMarkdown}
                        </pre>
                        </>
                      ) : (
                        !isLoading && (
                          <div className="text-center text-muted-foreground py-16">
                            <Wand2 className="mx-auto h-12 w-12 mb-4" />
                            <p>Something went wrong. Please try generating your plan again.</p>
                          </div>
                        )
                      )}
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center pt-4 mt-auto">
                <div>
                  {currentStep > 0 && currentStep < 3 && (
                    <Button type="button" variant="ghost" onClick={handleBack} disabled={isLoading}>
                      <ArrowLeft className="mr-2" />
                      Back
                    </Button>
                  )}
                </div>

                <div>
                  {currentStep < 2 && (
                    <Button type="button" onClick={handleNext} disabled={!canGenerate || isLoading}>
                      Next <ArrowRight className="ml-2" />
                    </Button>
                  )}

                  {currentStep === 2 && (
                    <Button type="submit" disabled={!canGenerate || isLoading || !form.watch("buildTool")}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Generate Plan
                    </Button>
                  )}
                  {currentStep === 3 && (
                    <Button type="button" onClick={handleStartOver}>
                      Start Over
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
