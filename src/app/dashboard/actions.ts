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

async function incrementGenerationCountAction() {
    const headersList = headers();
    const userCookie = headersList.get('cookie')?.split('; ').find(c => c.startsWith('user='))?.split('=')[1];
    
    if (!userCookie) {
        throw new Error("Authentication required. Please log in.");
    }
    
    // The cookie is URL-encoded, so we need to decode it before parsing
    const decodedCookie = decodeURIComponent(userCookie);
    const user = JSON.parse(decodedCookie);

    if (!user || !user.uid) {
        throw new Error("Authentication failed. User not found.");
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

    if(result) {
        await incrementGenerationCountAction();
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
