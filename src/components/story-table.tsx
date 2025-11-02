'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Project, UserStory } from '@/context/project-context';
import { useProjects } from '@/context/project-context';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Bot, Sparkles, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { TagPopover } from './tag-popover';
import { Checkbox } from '@/components/ui/checkbox';
import { StoryBulkActions } from './story-bulk-actions';

interface StoryTableProps {
  project: Project;
  tagFilter: string[];
}

export function StoryTable({ project, tagFilter }: StoryTableProps) {
  const { addStory, updateStory, addBulkStories, bulkDeleteStories, bulkUpdateTags } = useProjects();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [refiningStory, setRefiningStory] = useState<UserStory | null>(null);
  const [generatingFromStory, setGeneratingFromStory] = useState<UserStory | null>(null);
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    project.stories.forEach(story => {
      story.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [project.stories]);

  const filteredStories = useMemo(() => {
    if (tagFilter.length === 0) {
      return project.stories;
    }
    return project.stories.filter(story => 
      tagFilter.every(filterTag => story.tags.includes(filterTag))
    );
  }, [project.stories, tagFilter]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedStoryIds([]);
  }, [tagFilter]);


  const handleAddStory = (newStoryData: Omit<UserStory, 'id' | 'createdAt'>) => {
    addStory(project.id, newStoryData);
  };

  const handleUpdateStory = (updatedStory: UserStory) => {
    updateStory(project.id, updatedStory);
  };
  
  const handleGenerateStories = (baseStory: UserStory, newStories: string[]) => {
    addBulkStories(project.id, newStories);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStoryIds(filteredStories.map(s => s.id));
    } else {
      setSelectedStoryIds([]);
    }
  }

  const handleSelectRow = (storyId: string, checked: boolean) => {
    if (checked) {
      setSelectedStoryIds(prev => [...prev, storyId]);
    } else {
      setSelectedStoryIds(prev => prev.filter(id => id !== storyId));
    }
  }

  const numSelected = selectedStoryIds.length;
  const numFiltered = filteredStories.length;
  const areAllSelected = numSelected > 0 && numSelected === numFiltered;
  const areSomeSelected = numSelected > 0 && numSelected < numFiltered;

  return (
    <>
      <div className="h-full flex flex-col border rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            {numSelected > 0 ? (
                <StoryBulkActions 
                    projectId={project.id}
                    selectedStoryIds={selectedStoryIds}
                    allTags={allTags}
                    onClearSelection={() => setSelectedStoryIds([])}
                    onDelete={bulkDeleteStories}
                    onUpdateTags={bulkUpdateTags}
                />
            ) : (
                <h2 className="text-xl font-semibold font-headline">User Stories</h2>
            )}
          </div>
          {numSelected === 0 && (
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Story
            </Button>
          )}
        </div>
        <ScrollArea className="flex-grow">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-12">
                   <Checkbox
                    checked={areAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[65%]">Story</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStories && filteredStories.length > 0 ? (
                filteredStories.map((story) => (
                  <TableRow key={story.id} data-state={selectedStoryIds.includes(story.id) ? 'selected' : ''}>
                     <TableCell>
                      <Checkbox
                        checked={selectedStoryIds.includes(story.id)}
                        onCheckedChange={(checked) => handleSelectRow(story.id, !!checked)}
                        aria-label={`Select story ${story.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{story.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1">
                        {story.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                         <TagPopover 
                          story={story}
                          allTags={allTags}
                          onUpdateStory={handleUpdateStory}
                        >
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </TagPopover>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setRefiningStory(story)}>
                            <Sparkles className="mr-2 h-4 w-4 text-primary" />
                            Refine with AI
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setGeneratingFromStory(story)}>
                            <Bot className="mr-2 h-4 w-4 text-primary" />
                            Generate More
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No stories match the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <AddStoryModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddStory={handleAddStory}
      />
      {refiningStory && (
        <RefineStoryModal
          story={refiningStory}
          onClose={() => setRefiningStory(null)}
          onSave={handleUpdateStory}
        />
      )}
      {generatingFromStory && (
        <GenerateStoriesModal
          story={generatingFromStory}
          onClose={() => setGeneratingFromStory(null)}
          onGenerate={handleGenerateStories}
        />
      )}
    </>
  );
}

const AddStoryModal = ({ isOpen, onClose, onAddStory }: {
    isOpen: boolean;
    onClose: () => void;
    onAddStory: (story: Omit<UserStory, 'id' | 'projectId' | 'createdAt'>) => void;
}) => {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    onAddStory({ description, tags: tags.split(',').map(t => t.trim()).filter(Boolean) });
    setDescription('');
    setTags('');
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User Story</DialogTitle>
          <DialogDescription>Describe the feature or requirement from a user's perspective.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="As a [user type], I want [an action] so that [a benefit]..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
            <Input 
              placeholder="Tags (comma-separated), e.g., UI, auth, performance"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90">Add Story</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const RefineStoryModal = ({ story, onClose, onSave }: {
    story: UserStory;
    onClose: () => void;
    onSave: (story: UserStory) => void;
}) => {
  const [refinedStory, setRefinedStory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const runRefinement = async () => {
      try {
        setIsLoading(true);
        setError('');
        const { refineUserStory } = await import('@/lib/actions');
        const result = await refineUserStory({ userStory: story.description });
        setRefinedStory(result.refinedUserStory);
      } catch (e) {
        setError('Failed to refine story. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    runRefinement();
  }, [story]);

  const handleSave = () => {
    onSave({ ...story, description: refinedStory });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> AI Story Refinement</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 my-4">
          <div>
            <h3 className="font-semibold mb-2">Original Story</h3>
            <p className="text-sm p-4 bg-muted rounded-md h-full">{story.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">AI-Refined Suggestion</h3>
            {isLoading ? (
              <div className="p-4 border rounded-md h-full flex items-center justify-center">
                <Bot className="animate-spin h-6 w-6 text-primary" />
              </div>
            ) : error ? (
                <div className="p-4 border rounded-md h-full flex items-center justify-center text-destructive">{error}</div>
            ) : (
              <p className="text-sm p-4 border border-primary rounded-md h-full bg-primary/5">{refinedStory}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Discard</Button>
          <Button onClick={handleSave} disabled={isLoading || !!error} className="bg-accent hover:bg-accent/90">Save Refined Story</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GenerateStoriesModal = ({ story, onClose, onGenerate }: {
    story: UserStory;
    onClose: () => void;
    onGenerate: (story: UserStory, newStories: string[]) => void;
}) => {
  const [numStories, setNumStories] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError('');
      const { generateStories } = await import('@/lib/actions');
      const result = await generateStories({ existingStory: story.description, numberOfStories: numStories });
      onGenerate(story, result.newStories);
      toast({ title: 'Success', description: `${result.newStories.length} new stories generated.` });
      onClose();
    } catch (e) {
      setError('Failed to generate stories. Please try again.');
      toast({ variant: "destructive", title: 'Error', description: 'Failed to generate stories.' });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Bot className="text-primary"/> Bulk Story Generation</DialogTitle>
          <DialogDescription>Generate multiple new stories based on an existing one.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm font-semibold mb-2">Base Story:</p>
            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground mb-4">
              {story.description}
            </blockquote>
            <Label htmlFor="num-stories">Number of stories to generate:</Label>
            <Input id="num-stories" type="number" value={numStories} onChange={(e) => setNumStories(parseInt(e.target.value, 10))} min="1" max="10" className="mt-2"/>
        </div>
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={isLoading} className="bg-accent hover:bg-accent/90">
            {isLoading ? <Bot className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
