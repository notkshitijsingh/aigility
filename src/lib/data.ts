export type Priority = 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';

export interface UserStory {
  id: string;
  description: string;
  tags: string[];
  priority: Priority;
  projectId?: string;
  createdAt: any; // Can be Timestamp or FieldValue
}

export interface Project {
  id: string;
  title: string;
  description: string;
  stories: UserStory[];
  userId?: string;
  order: number;
}

export const initialProjects: Project[] = [];
