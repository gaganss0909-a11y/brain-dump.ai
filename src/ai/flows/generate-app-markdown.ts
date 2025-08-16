'use server';

/**
 * @fileOverview An AI agent that generates a structured Markdown file based on an app idea.
 *
 * - generateAppMarkdown - A function that handles the app idea processing and Markdown generation.
 * - GenerateAppMarkdownInput - The input type for the generateAppMarkdown function.
 * - GenerateAppMarkdownOutput - The return type for the generateAppMarkdown function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppMarkdownInputSchema = z.object({
  appIdea: z.string().describe('The user-provided idea for the app.'),
  appType: z.enum(['Web App', 'Mobile App']).describe('The type of app to be built.'),
  buildTool: z
    .enum(['Windsurf', 'Bolt.new', 'Lovable'])
    .describe('The build tool to be used.'),
});
export type GenerateAppMarkdownInput = z.infer<typeof GenerateAppMarkdownInputSchema>;

const GenerateAppMarkdownOutputSchema = z.object({
  markdownContent: z
    .string()
    .describe('The generated Markdown content for the app idea.'),
});
export type GenerateAppMarkdownOutput = z.infer<typeof GenerateAppMarkdownOutputSchema>;

export async function generateAppMarkdown(
  input: GenerateAppMarkdownInput
): Promise<GenerateAppMarkdownOutput> {
  return generateAppMarkdownFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppMarkdownPrompt',
  input: {schema: GenerateAppMarkdownInputSchema},
  output: {schema: GenerateAppMarkdownOutputSchema},
  prompt: `You are an AI that helps generate a structured Markdown file for app ideas.

  The user will provide an app idea, the type of app (Web App or Mobile App), and the build tool to be used.
  Your task is to process this information and generate a detailed Markdown file that includes the following sections:

  - **Summary:** A concise summary of the app idea.
  - **Features:** Suggested features for the app.
  - **Tech Stack:** Recommended tech stack based on the app type and build tool.
  - **Development Steps:** A step-by-step guide for developing the app.
  - **Integrations:** Potential integrations with other services or platforms.

  Here is the information provided by the user:

  App Idea: {{{appIdea}}}
  App Type: {{{appType}}}
  Build Tool: {{{buildTool}}}

  Please generate the Markdown content. Make sure it is well-structured and easy to read.

  Do not include any introductory or concluding remarks.  Just the markdown.
  Do not include any links.
  Do not include any HTML.
  Make sure there are no rendering errors in the markdown.
  Make sure that there are no unterminated lists or other markdown errors.
  Do not include any YAML headers.
  `,
});

const generateAppMarkdownFlow = ai.defineFlow(
  {
    name: 'generateAppMarkdownFlow',
    inputSchema: GenerateAppMarkdownInputSchema,
    outputSchema: GenerateAppMarkdownOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
