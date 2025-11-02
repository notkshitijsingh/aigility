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

const GenerateStoriesInputSchema = z.object({
  existingStory: z.string().describe('The existing user story to generate from.'),
  numberOfStories: z.number().describe('The number of stories to generate.'),
});

export type GenerateStoriesInput = z.infer<typeof GenerateStoriesInputSchema>;

const GenerateStoriesOutputSchema = z.object({
  newStories: z.array(z.string()).describe('An array of generated user stories.'),
});

export type GenerateStoriesOutput = z.infer<typeof GenerateStoriesOutputSchema>;

export async function generateStories(input: GenerateStoriesInput): Promise<GenerateStoriesOutput> {
  return generateStoriesFlow(input);
}

const generateStoriesPrompt = ai.definePrompt({
  name: 'generateStoriesPrompt',
  input: {schema: GenerateStoriesInputSchema},
  output: {schema: GenerateStoriesOutputSchema},
  prompt: `You are a product owner who is expert at writing user stories. Based on the following existing user story, generate {{numberOfStories}} new user stories.

Existing User Story: {{{existingStory}}}

New User Stories:

{{#times numberOfStories}}
- 
{{/times}}`,
  templateHelpers: {
    times: function (n: number, block: any) {
      let accum = '';
      for (let i = 0; i < n; ++i) accum += block.fn(i);
      return accum;
    },
  },
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
