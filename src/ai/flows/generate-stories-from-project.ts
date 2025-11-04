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

const GeneratedStorySchema = z.object({
  description: z.string().describe('The user story description.'),
  priority: z.enum(['Highest', 'High', 'Medium', 'Low', 'Lowest']).describe('The priority of the user story.'),
});

const GenerateStoriesFromProjectInputSchema = z.object({
  projectDescription: z.string().describe('The project description to generate stories from.'),
  numberOfStories: z.number().describe('The number of stories to generate.'),
});

export type GenerateStoriesFromProjectInput = z.infer<typeof GenerateStoriesFromProjectInputSchema>;

const GenerateStoriesFromProjectOutputSchema = z.object({
  newStories: z.array(GeneratedStorySchema).describe('An array of generated user stories with priorities.'),
});

export type GeneratedStory = z.infer<typeof GeneratedStorySchema>;
export type GenerateStoriesFromProjectOutput = z.infer<typeof GenerateStoriesFromProjectOutputSchema>;

export async function generateStoriesFromProject(input: GenerateStoriesFromProjectInput): Promise<GenerateStoriesFromProjectOutput> {
  return generateStoriesFromProjectFlow(input);
}

const generateStoriesFromProjectPrompt = ai.definePrompt({
  name: 'generateStoriesFromProjectPrompt',
  input: {schema: GenerateStoriesFromProjectInputSchema},
  output: {schema: GenerateStoriesFromProjectOutputSchema},
  prompt: `You are a product owner who is an expert at writing user stories and assigning priorities. Based on the following project description, generate {{numberOfStories}} new user stories.

For each story, provide a description and a priority from the following list: Highest, High, Medium, Low, Lowest.

Project Description: {{{projectDescription}}}

Your response should be a list of user stories, each with a description and a priority.`,
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
