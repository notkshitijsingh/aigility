'use server';

import { 
  refineUserStory as refineUserStoryFlow, 
  type RefineUserStoryInput,
  type RefineUserStoryOutput,
} from '@/ai/flows/refine-user-story';
import { 
  generateStories as generateStoriesFlow,
  type GenerateStoriesInput,
  type GenerateStoriesOutput,
} from '@/ai/flows/generate-stories';
import {
  generateStoriesFromProject as generateStoriesFromProjectFlow,
  type GenerateStoriesFromProjectInput,
  type GenerateStoriesFromProjectOutput,
} from '@/ai/flows/generate-stories-from-project';
import {
  generateStoriesFromTags as generateStoriesFromTagsFlow,
  type GenerateStoriesFromTagsInput,
  type GenerateStoriesFromTagsOutput,
} from '@/ai/flows/generate-stories-from-tags';

export async function refineUserStory(input: RefineUserStoryInput): Promise<RefineUserStoryOutput> {
  // Add any additional server-side logic, validation, or logging here.
  console.log('Refining story:', input.userStory);
  try {
    const result = await refineUserStoryFlow(input);
    return result;
  } catch (error) {
    console.error('Error in refineUserStory server action:', error);
    throw new Error('Failed to refine user story.');
  }
}

export async function generateStories(input: GenerateStoriesInput): Promise<GenerateStoriesOutput> {
  // Add any additional server-side logic, validation, or logging here.
  console.log(`Generating ${input.numberOfStories} stories from:`, input.existingStory);
  try {
    const result = await generateStoriesFlow(input);
    return result;
  } catch (error) {
    console.error('Error in generateStories server action:', error);
    throw new Error('Failed to generate stories.');
  }
}

export async function generateStoriesFromProject(input: GenerateStoriesFromProjectInput): Promise<GenerateStoriesFromProjectOutput> {
  console.log(`Generating ${input.numberOfStories} stories from project description:`, input.projectDescription);
  try {
    const result = await generateStoriesFromProjectFlow(input);
    return result;
  } catch (error) {
    console.error('Error in generateStoriesFromProject server action:', error);
    throw new Error('Failed to generate stories from project.');
  }
}

export async function generateStoriesFromTags(input: GenerateStoriesFromTagsInput): Promise<GenerateStoriesFromTagsOutput> {
  console.log(`Generating ${input.numberOfStories} stories from tags:`, input.tags.join(', '));
  try {
    const result = await generateStoriesFromTagsFlow(input);
    return result;
  } catch (error) {
    console.error('Error in generateStoriesFromTags server action:', error);
    throw new Error('Failed to generate stories from tags.');
  }
}
