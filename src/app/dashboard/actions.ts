"use server";

import { z } from "zod";
import {
  generateAppMarkdown,
  type GenerateAppMarkdownInput,
} from "@/ai/flows/generate-app-markdown";

const formSchema = z.object({
  appIdea: z.string().min(10, {
    message: "Your app idea must be at least 10 characters.",
  }),
  appType: z.enum(["Web App", "Mobile App"], {
    required_error: "You need to select an app type.",
  }),
  buildTool: z.enum(["Windsurf", "Bolt.new", "Lovable"], {
    required_error: "You need to select a build tool.",
  }),
});

export async function generatePlanAction(values: z.infer<typeof formSchema>) {
  try {
    const validatedData: GenerateAppMarkdownInput = formSchema.parse(values);
    const result = await generateAppMarkdown(validatedData);
    return { success: true, data: result.markdownContent };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation failed.", issues: error.errors };
    }
    console.error("Error generating markdown:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
