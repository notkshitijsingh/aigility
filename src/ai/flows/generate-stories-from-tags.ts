'use server';

/**
 * @fileOverview Generates multiple user stories based on a set of tags and a project description.
 *
 * - generateStoriesFromTags - A function that generates multiple user stories based on tags.
 * - GenerateStoriesFromTagsInput - The input type for the generateStoriesFromTags function.
 * - GenerateStoriesFromTagsOutput - The return type for the generateStoriesFromTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoriesFromTagsInputSchema = z.object({
  projectDescription: z.string().describe('The project description for context.'),
  tags: z.array(z.string()).describe('The tags to generate stories from.'),
  numberOfStories: z.number().describe('The number of stories to generate.'),
});

export type GenerateStoriesFromTagsInput = z.infer<typeof GenerateStoriesFromTagsInputSchema>;

const GenerateStoriesFromTagsOutputSchema = z.object({
  newStories: z.array(z.string()).describe('An array of generated user stories.'),
});

export type GenerateStoriesFromTagsOutput = z.infer<typeof GenerateStoriesFromTagsOutputSchema>;

export async function generateStoriesFromTags(input: GenerateStoriesFromTagsInput): Promise<GenerateStoriesFromTagsOutput> {
  return generateStoriesFromTagsFlow(input);
}

const generateStoriesFromTagsPrompt = ai.definePrompt({
  name: 'generateStoriesFromTagsPrompt',
  input: {schema: GenerateStoriesFromTagsInputSchema},
  output: {schema: GenerateStoriesFromTagsOutputSchema},
  prompt: `You are a product owner who is an expert at writing user stories. Based on the following project description and tags, generate {{numberOfStories}} new user stories.

Project Description: {{{projectDescription}}}

Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Your response should be a list of user stories.`,
});

const generateStoriesFromTagsFlow = ai.defineFlow(
  {
    name: 'generateStoriesFromTagsFlow',
    inputSchema: GenerateStoriesFromTagsInputSchema,
    outputSchema: GenerateStoriesFromTagsOutputSchema,
  },
  async input => {
    const {output} = await generateStoriesFromTagsPrompt(input);
    return output!;
  }
);
