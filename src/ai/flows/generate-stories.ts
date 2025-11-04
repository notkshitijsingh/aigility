// This file holds the Genkit flow for generating multiple user stories based on an existing one.

'use server';

/**
 * @fileOverview Generates multiple user stories based on an existing one.
 *
 * - generateStories - A function that generates multiple user stories based on an existing one.
 * - GenerateStoriesInput - The input type for the generateStories function.
 * - GenerateStoriesOutput - The return type for the generateStories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Priority } from '@/lib/data';

const GeneratedStorySchema = z.object({
  description: z.string().describe('The user story description.'),
  priority: z.enum(['Highest', 'High', 'Medium', 'Low', 'Lowest']).describe('The priority of the user story.'),
});

const GenerateStoriesInputSchema = z.object({
  existingStory: z.string().describe('The existing user story to generate from.'),
  numberOfStories: z.number().describe('The number of stories to generate.'),
});

export type GenerateStoriesInput = z.infer<typeof GenerateStoriesInputSchema>;

const GenerateStoriesOutputSchema = z.object({
  newStories: z.array(GeneratedStorySchema).describe('An array of generated user stories with priorities.'),
});

export type GeneratedStory = z.infer<typeof GeneratedStorySchema>;
export type GenerateStoriesOutput = z.infer<typeof GenerateStoriesOutputSchema>;


export async function generateStories(input: GenerateStoriesInput): Promise<GenerateStoriesOutput> {
  return generateStoriesFlow(input);
}

const generateStoriesPrompt = ai.definePrompt({
  name: 'generateStoriesPrompt',
  input: {schema: GenerateStoriesInputSchema},
  output: {schema: GenerateStoriesOutputSchema},
  prompt: `You are a product owner who is expert at writing user stories and assigning priorities. Based on the following existing user story, generate {{numberOfStories}} new user stories.

For each story, provide a description and a priority from the following list: Highest, High, Medium, Low, Lowest.

Existing User Story: {{{existingStory}}}

Generate the new user stories with their priorities.`,
});

const generateStoriesFlow = ai.defineFlow(
  {
    name: 'generateStoriesFlow',
    inputSchema: GenerateStoriesInputSchema,
    outputSchema: GenerateStoriesOutputSchema,
  },
  async input => {
    const {output} = await generateStoriesPrompt(input);
    return output!;
  }
);
