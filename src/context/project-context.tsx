'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, arrayUnion, arrayRemove, deleteDoc, onSnapshot, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Project as ProjectData, UserStory as UserStoryData, Priority } from '@/lib/data';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { GeneratedStory } from '@/ai/flows/generate-stories';


// Exporting the types to be used in other components
export type { ProjectData, UserStoryData, Priority };

export type Project = ProjectData;
export type UserStory = UserStoryData;


interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'userId' | 'stories' | 'order'>) => void;
  updateProject: (projectId: string, data: Partial<Omit<Project, 'id' | 'userId' | 'stories'>>) => void;
  deleteProject: (projectId: string) => void;
  addStory: (projectId: string, story: Omit<UserStory, 'id' | 'createdAt'>) => void;
  updateStory: (projectId: string, updatedStory: UserStory) => void;
  deleteStory: (projectId: string, storyId: string) => void;
  addBulkStories: (projectId: string, newStories: GeneratedStory[], tags?: string[]) => void;
  bulkDeleteStories: (projectId: string, storyIds: string[]) => void;
  bulkUpdateTags: (projectId: string, storyIds: string[], tags: string[], action: 'add' | 'remove') => void;
  setProjectsOrder: (projects: Project[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const firestore = useFirestore();
  const [projects, setProjects] = useState<Project[]>([]);
  
  const projectsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, `users/${user.uid}/projects`), orderBy('order')) : null
  , [user, firestore]);
  
  const { data: firestoreProjects, isLoading: loadingProjects } = useCollection<Omit<Project, 'stories'>>(projectsQuery);

  const [localStories, setLocalStories] = useState<Record<string, UserStory[]>>({});
  const [storiesLoading, setStoriesLoading] = useState<Record<string, boolean>>({});

  // This effect will fetch stories for each project.
  useEffect(() => {
    if (!firestoreProjects || !user || !firestore) return;

    const unsubscribes: (() => void)[] = [];

    firestoreProjects.forEach(project => {
        setStoriesLoading(prev => ({...prev, [project.id]: true}));
        const storiesQuery = query(collection(firestore, `users/${user.uid}/projects/${project.id}/stories`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
            const stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserStory));
            setLocalStories(prev => ({ ...prev, [project.id]: stories }));
            setStoriesLoading(prev => ({...prev, [project.id]: false}));
        });
        unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach(unsub => unsub());

  }, [firestoreProjects, user, firestore]);

  // This effect merges projects from firestore with their stories
  useEffect(() => {
    if (!firestoreProjects) {
        setProjects([]);
        return;
    };
    
    const mergedProjects = firestoreProjects.map(p => ({
        ...p,
        stories: localStories[p.id] || [],
    }));
    setProjects(mergedProjects);
  }, [firestoreProjects, localStories]);

  const addProject = async (projectData: Omit<Project, 'id' | 'stories' | 'userId' | 'order'>) => {
    if (!user || !firestore) return;
    const projectsColRef = collection(firestore, `users/${user.uid}/projects`);
    // Get current max order
    const q = query(projectsColRef, orderBy('order', 'desc'));
    const snapshot = await getDocs(q);
    const maxOrder = snapshot.docs.length > 0 ? (snapshot.docs[0].data().order || 0) : 0;
    
    addDocumentNonBlocking(projectsColRef, { ...projectData, userId: user.uid, order: maxOrder + 1 });
  };
  
  const updateProject = (projectId: string, data: Partial<Omit<Project, 'id' | 'userId' | 'stories'>>) => {
    if (!user || !firestore) return;
    const projectRef = doc(firestore, `users/${user.uid}/projects`, projectId);
    updateDocumentNonBlocking(projectRef, data);
  };

  const deleteProject = async (projectId: string) => {
    if (!user || !firestore) return;
    const projectRef = doc(firestore, `users/${user.uid}/projects`, projectId);
    
    // Delete all stories in the project's subcollection
    const storiesColRef = collection(projectRef, 'stories');
    const storiesSnapshot = await getDocs(storiesColRef);
    const batch = writeBatch(firestore);
    storiesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Delete the project document itself
    deleteDocumentNonBlocking(projectRef);
  };

  const addStory = (projectId: string, storyData: Omit<UserStory, 'id' | 'createdAt'>) => {
    if (!user || !firestore) return;
    const projectRef = doc(firestore, `users/${user.uid}/projects`, projectId);
    const storiesColRef = collection(projectRef, 'stories');
    addDocumentNonBlocking(storiesColRef, { ...storyData, projectId, createdAt: serverTimestamp() });
  };

  const updateStory = (projectId: string, updatedStory: UserStory) => {
    if (!user || !firestore) return;
    const storyRef = doc(firestore, `users/${user.uid}/projects/${projectId}/stories`, updatedStory.id);
    const { id, ...storyData } = updatedStory;
    updateDocumentNonBlocking(storyRef, storyData);
  };

  const deleteStory = (projectId: string, storyId: string) => {
    if (!user || !firestore) return;
    const storyRef = doc(firestore, `users/${user.uid}/projects/${projectId}/stories`, storyId);
    deleteDocumentNonBlocking(storyRef);
  };
  
  const addBulkStories = (projectId: string, newStories: GeneratedStory[], tags: string[] = []) => {
    if(!user) return;
    const baseTags = ['generated'];
    const finalTags = [...new Set([...baseTags, ...tags])]; // Combine and remove duplicates

    newStories.forEach(story => {
      addStory(projectId, {
        description: story.description,
        priority: story.priority,
        tags: finalTags,
      });
    });
  };

  const bulkDeleteStories = async (projectId: string, storyIds: string[]) => {
    if (!user || !firestore) return;
    storyIds.forEach(storyId => {
        const storyRef = doc(firestore, `users/${user.uid}/projects/${projectId}/stories`, storyId);
        deleteDocumentNonBlocking(storyRef);
    });
  };

  const bulkUpdateTags = (projectId: string, storyIds: string[], tags: string[], action: 'add' | 'remove') => {
    if (!user || !firestore) return;
    storyIds.forEach(storyId => {
        const storyRef = doc(firestore, `users/${user.uid}/projects/${projectId}/stories`, storyId);
        updateDocumentNonBlocking(storyRef, {
            tags: action === 'add' ? arrayUnion(...tags) : arrayRemove(...tags)
        });
    });
  };

  const setProjectsOrder = (orderedProjects: Project[]) => {
    if (!user || !firestore) return;
    const batch = writeBatch(firestore);
    orderedProjects.forEach((project, index) => {
        const projectRef = doc(firestore, `users/${user.uid}/projects`, project.id);
        batch.update(projectRef, { order: index });
    });
    setProjects(orderedProjects); // Optimistic update
    batch.commit().catch(err => {
      console.error("Failed to update project order", err);
      // Here you might want to revert the optimistic update
    });
  }

  const isLoading = loadingProjects || Object.values(storiesLoading).some(s => s);


  return (
    <ProjectContext.Provider value={{ projects, loading: isLoading, addProject, updateProject, deleteProject, addStory, updateStory, deleteStory, addBulkStories, bulkDeleteStories, bulkUpdateTags, setProjectsOrder }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
