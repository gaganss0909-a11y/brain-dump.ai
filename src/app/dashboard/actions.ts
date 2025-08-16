"use server";

import { z } from "zod";
import {
  generateAppMarkdown,
  type GenerateAppMarkdownInput,
} from "@/ai/flows/generate-app-markdown";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { headers } from "next/headers";

const formSchema = z.object({
  appIdea: z.string().min(20, {
    message: "Your app idea must be at least 20 characters.",
  }),
  appType: z.enum(["Web App", "Mobile App"], {
    required_error: "You need to select an app type.",
  }),
  buildTool: z.enum(["Windsurf", "Bolt.new", "Lovable"], {
    required_error: "You need to select a build tool.",
  }),
});

async function incrementGenerationCount() {
    const headersList = headers();
    const userCookie = headersList.get('cookie')?.split('; ').find(c => c.startsWith('user='))?.split('=')[1];
    
    if (!userCookie) {
        // This case should ideally not be hit if the page is protected
        throw new Error("Authentication required to increment count.");
    }
    
    const decodedCookie = decodeURIComponent(userCookie);
    const user = JSON.parse(decodedCookie);

    if (!user?.uid) {
        throw new Error("Invalid user data in cookie.");
    }

    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
        generationCount: increment(1)
    });
}


export async function generatePlanAction(values: z.infer<typeof formSchema>) {
  try {
    const validatedData: GenerateAppMarkdownInput = formSchema.parse(values);
    const result = await generateAppMarkdown(validatedData);

    // Only increment count if the generation was successful
    if (result) {
        await incrementGenerationCount();
    }
    
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
