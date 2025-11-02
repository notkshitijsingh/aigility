'use server';

/**
 * @fileOverview Generates multiple user stories based on a project description.
 *
 * - generateStoriesFromProject - A function that generates multiple user stories based on a project description.
 * - GenerateStoriesFromProjectInput - The input type for the generateStoriesFromProject function.
 * - GenerateStoriesFromProjectOutput - The return type for the generateStoriesFromProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoriesFromProjectInputSchema = z.object({
  projectDescription: z.string().describe('The project description to generate stories from.'),
  numberOfStories: z.number().describe('The number of stories to generate.'),
});

export type GenerateStoriesFromProjectInput = z.infer<typeof GenerateStoriesFromProjectInputSchema>;

const GenerateStoriesFromProjectOutputSchema = z.object({
  newStories: z.array(z.string()).describe('An array of generated user stories.'),
});

export type GenerateStoriesFromProjectOutput = z.infer<typeof GenerateStoriesFromProjectOutputSchema>;

export async function generateStoriesFromProject(input: GenerateStoriesFromProjectInput): Promise<GenerateStoriesFromProjectOutput> {
  return generateStoriesFromProjectFlow(input);
}

const generateStoriesFromProjectPrompt = ai.definePrompt({
  name: 'generateStoriesFromProjectPrompt',
  input: {schema: GenerateStoriesFromProjectInputSchema},
  output: {schema: GenerateStoriesFromProjectOutputSchema},
  prompt: `You are a product owner who is an expert at writing user stories. Based on the following project description, generate {{numberOfStories}} new user stories.

Project Description: {{{projectDescription}}}

Your response should be a list of user stories.`,
});

const generateStoriesFromProjectFlow = ai.defineFlow(
  {
    name: 'generateStoriesFromProjectFlow',
    inputSchema: GenerateStoriesFromProjectInputSchema,
    outputSchema: GenerateStoriesFromProjectOutputSchema,
  },
  async input => {
    const {output} = await generateStoriesFromProjectPrompt(input);
    return output!;
  }
);
