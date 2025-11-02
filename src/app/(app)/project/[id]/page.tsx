'use client';

import { useProjects } from '@/context/project-context';
import { notFound, useParams } from 'next/navigation';
import { StoryTable } from '@/components/story-table';
import { Button } from '@/components/ui/button';
import { FileDown, Bot, Sparkles } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function ProjectPage() {
  const { id } = useParams();
  const { projects, addBulkStories, updateProject } = useProjects();
  const project = projects.find((p) => p.id === id);

  const [isGenerateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<MultiSelectOption[]>([]);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editableTitle, setEditableTitle] = useState(project?.title || '');
  const [editableDesc, setEditableDesc] = useState(project?.description || '');

  useEffect(() => {
    if (project) {
        setEditableTitle(project.title);
        setEditableDesc(project.description);
    }
  }, [project]);

  const allTags = useMemo(() => {
    if (!project) return [];
    const tagSet = new Set<string>();
    project.stories.forEach(story => {
      story.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).map(tag => ({ value: tag, label: tag }));
  }, [project]);

  const handleUpdateProject = () => {
    if (project && (editableTitle !== project.title || editableDesc !== project.description)) {
        updateProject(project.id, { title: editableTitle, description: editableDesc });
    }
    setIsEditingTitle(false);
    setIsEditingDesc(false);
  };


  if (!project) {
    // In a real app, you might fetch data here or show a loading state
    // For this mock app, if it's not in context, it's not found.
    return notFound();
  }

  const handleExport = () => {
    const headers = 'Summary,Description,Labels,Issue Type,Created Date';
    const rows = project.stories.map(story => {
      const summary = `"${story.description.split('.').slice(0, 1).join('.').replace(/"/g, '""')}"`;
      const description = `"${story.description.replace(/"/g, '""')}"`;
      const labels = `"${(story.tags || []).join(' ')}"`;
      const issueType = 'Story';
      const createdDate = story.createdAt?.toDate ? `"${story.createdAt.toDate().toISOString()}"` : '""';
      return [summary, description, labels, issueType, createdDate].join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${project.title.replace(/\s+/g, '_')}_stories.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateStories = (newStories: string[], tags: string[] = []) => {
    if (project) {
      addBulkStories(project.id, newStories, tags);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="w-full pr-8">
            {isEditingTitle ? (
                <Input
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    onBlur={handleUpdateProject}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateProject()}
                    autoFocus
                    className="text-3xl font-bold font-headline h-auto p-0 border-0 shadow-none focus-visible:ring-0"
                />
            ) : (
                <h1 className="text-3xl font-bold font-headline cursor-pointer" onClick={() => setIsEditingTitle(true)}>{project.title}</h1>
            )}

            {isEditingDesc ? (
                <Textarea
                    value={editableDesc}
                    onChange={(e) => setEditableDesc(e.target.value)}
                    onBlur={handleUpdateProject}
                    autoFocus
                    className="mt-1 text-muted-foreground p-0 border-0 shadow-none focus-visible:ring-0 resize-none"
                    rows={2}
                />
            ) : (
                <p className="text-muted-foreground mt-1 cursor-pointer min-h-[24px]" onClick={() => setIsEditingDesc(true)}>
                    {project.description || <span className="text-muted-foreground/60">Click to add a description</span>}
                </p>
            )}
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setGenerateModalOpen(true)}>
                <Bot className="mr-2 h-4 w-4"/>
                Generate Stories
            </Button>
            <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4"/>
            JIRA Export
            </Button>
        </div>
      </div>
      <div className="mb-4">
        <MultiSelect 
          options={allTags}
          selected={selectedTags}
          onChange={setSelectedTags}
          placeholder="Filter by tags..."
          className="w-full md:w-1/2"
        />
      </div>
      <div className="flex-grow overflow-hidden">
        <StoryTable project={project} tagFilter={selectedTags.map(t => t.value)} />
      </div>

      {isGenerateModalOpen && (
        <GenerateStoriesModal
          project={project}
          allTags={allTags}
          onClose={() => setGenerateModalOpen(false)}
          onGenerate={handleGenerateStories}
        />
      )}
    </div>
  );
}

const GenerateStoriesModal = ({ project, allTags, onClose, onGenerate }: {
    project: any;
    allTags: MultiSelectOption[];
    onClose: () => void;
    onGenerate: (newStories: string[], tags: string[]) => void;
}) => {
  const [numStories, setNumStories] = useState(3);
  const [selectedTags, setSelectedTags] = useState<MultiSelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editableDesc, setEditableDesc] = useState(project.description);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (activeTab === 'tags' && selectedTags.length === 0) {
        setError('Please select at least one tag.');
        return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      let result;
      let tagsForGeneration: string[] = [];
      if (activeTab === 'description') {
        const { generateStoriesFromProject } = await import('@/lib/actions');
        result = await generateStoriesFromProject({ projectDescription: editableDesc, numberOfStories: numStories });
      } else {
        tagsForGeneration = selectedTags.map(t => t.value)
        const { generateStoriesFromTags } = await import('@/lib/actions');
        result = await generateStoriesFromTags({ 
            projectDescription: editableDesc,
            tags: tagsForGeneration,
            numberOfStories: numStories 
        });
      }

      onGenerate(result.newStories, tagsForGeneration);
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Bot className="text-primary"/> Generate User Stories</DialogTitle>
          <DialogDescription>Generate multiple new user stories based on the project description or a set of tags.</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">From Description</TabsTrigger>
                <TabsTrigger value="tags">From Tags</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-4 space-y-4">
                {isEditingDesc ? (
                    <Textarea 
                        value={editableDesc}
                        onChange={(e) => setEditableDesc(e.target.value)}
                        onBlur={() => setIsEditingDesc(false)}
                        autoFocus
                        rows={5}
                        className="w-full p-4 bg-muted rounded-md"
                    />
                ) : (
                    <p className="text-sm p-4 bg-muted rounded-md italic cursor-pointer" onClick={() => setIsEditingDesc(true)}>
                        {editableDesc || "Click to add a description."}
                    </p>
                )}
                <div>
                    <Label htmlFor="num-stories-desc">Number of stories to generate:</Label>
                    <Input id="num-stories-desc" type="number" value={numStories} onChange={(e) => setNumStories(parseInt(e.target.value, 10))} min="1" max="10" className="mt-2"/>
                </div>
            </TabsContent>
            <TabsContent value="tags" className="py-4 space-y-4">
                <div>
                  <Label htmlFor="tags-select">Select tags to generate stories from:</Label>
                  <MultiSelect
                    options={allTags}
                    selected={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Select or create tags..."
                    className="w-full mt-2"
                    creatable
                  />
                </div>
                <div>
                  <Label htmlFor="num-stories-tags">Number of stories to generate:</Label>
                  <Input id="num-stories-tags" type="number" value={numStories} onChange={(e) => setNumStories(parseInt(e.target.value, 10))} min="1" max="10" className="mt-2"/>
                </div>
            </TabsContent>
        </Tabs>
        
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={isLoading || (activeTab === 'tags' && selectedTags.length === 0)} className="bg-accent hover:bg-accent/90">
            {isLoading ? <Bot className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
