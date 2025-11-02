'use client'

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Trash2, Tag, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

interface StoryBulkActionsProps {
    projectId: string;
    selectedStoryIds: string[];
    allTags: string[];
    onClearSelection: () => void;
    onDelete: (projectId: string, storyIds: string[]) => void;
    onUpdateTags: (projectId: string, storyIds: string[], tags: string[], action: 'add' | 'remove') => void;
}

export function StoryBulkActions({
    projectId,
    selectedStoryIds,
    allTags,
    onClearSelection,
    onDelete,
    onUpdateTags,
}: StoryBulkActionsProps) {
    const numSelected = selectedStoryIds.length;

    const handleDelete = () => {
        onDelete(projectId, selectedStoryIds);
        onClearSelection();
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{numSelected} selected</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClearSelection}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />

            <TagManagementDialog onUpdateTags={onUpdateTags} projectId={projectId} selectedStoryIds={selectedStoryIds} allTags={allTags} onClearSelection={onClearSelection} />
            
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Trash2 className="mr-2" /> Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the {numSelected} selected stories. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


function TagManagementDialog({ onUpdateTags, projectId, selectedStoryIds, allTags, onClearSelection }: any) {
    const [open, setOpen] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const { toast } = useToast();

    const handleTagAction = (action: 'add' | 'remove') => {
        const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
        if (tags.length === 0) {
            toast({ variant: 'destructive', title: 'No tags provided', description: 'Please enter one or more tags.' });
            return;
        }
        onUpdateTags(projectId, selectedStoryIds, tags, action);
        const actionPast = action === 'add' ? 'added' : 'removed';
        toast({ title: 'Tags updated', description: `Tags ${actionPast} for ${selectedStoryIds.length} stories.` });
        setTagInput('');
        onClearSelection();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Tag className="mr-2" /> Edit Tags
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bulk Edit Tags</DialogTitle>
                    <DialogDescription>
                        Add or remove tags for the {selectedStoryIds.length} selected stories. Enter one or more tags, separated by commas.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        placeholder="e.g., frontend, bug, high-priority"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />
                     <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Existing tags:</p>
                        <div className="flex flex-wrap gap-1">
                            {allTags.map((tag: any) => (
                                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => setTagInput(prev => prev ? `${prev}, ${tag}` : tag)}>{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => handleTagAction('remove')}>Remove Tags</Button>
                    <Button onClick={() => handleTagAction('add')} className="bg-accent hover:bg-accent/90">Add Tags</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
