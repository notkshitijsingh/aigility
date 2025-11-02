'use server';

/**
 * @fileOverview AI-powered user story refinement flow.
 *
 * This file defines a Genkit flow that uses AI to refine user stories, improving their clarity and completeness.
 *
 * @exports refineUserStory - An asynchronous function to refine a user story using AI.
 * @exports RefineUserStoryInput - The input type for the refineUserStory function.
 * @exports RefineUserStoryOutput - The output type for the refineUserStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineUserStoryInputSchema = z.object({
  userStory: z
    .string()
    .describe('The user story to refine. Include all details and tags.'),
});
export type RefineUserStoryInput = z.infer<typeof RefineUserStoryInputSchema>;

const RefineUserStoryOutputSchema = z.object({
  refinedUserStory: z
    .string()
    .describe('The refined user story with improved clarity and completeness.'),
});
export type RefineUserStoryOutput = z.infer<typeof RefineUserStoryOutputSchema>;

export async function refineUserStory(input: RefineUserStoryInput): Promise<RefineUserStoryOutput> {
  return refineUserStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineUserStoryPrompt',
  input: {schema: RefineUserStoryInputSchema},
  output: {schema: RefineUserStoryOutputSchema},
  prompt: `You are an expert product manager that refines user stories based on the following user story provided by the user. The goal is to improve clarity and completeness based on your product management experience.

User Story: {{{userStory}}}

Refined User Story:`,
});

const refineUserStoryFlow = ai.defineFlow(
  {
    name: 'refineUserStoryFlow',
    inputSchema: RefineUserStoryInputSchema,
    outputSchema: RefineUserStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
