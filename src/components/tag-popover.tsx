'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { UserStory } from '@/context/project-context';
import { Plus } from 'lucide-react';

interface TagPopoverProps {
  story: UserStory;
  allTags: string[];
  onUpdateStory: (updatedStory: UserStory) => void;
  children: React.ReactNode;
}

export function TagPopover({ story, allTags, onUpdateStory, children }: TagPopoverProps) {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleTagToggle = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...story.tags, tag]
      : story.tags.filter((t) => t !== tag);
    onUpdateStory({ ...story, tags: newTags });
  };

  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !story.tags.includes(newTag)) {
      onUpdateStory({ ...story, tags: [...story.tags, newTag] });
    }
    setNewTag('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <div className="p-4">
          <h4 className="font-medium leading-none mb-2">Edit Tags</h4>
          <p className="text-sm text-muted-foreground">Add or remove tags for this story.</p>
        </div>
        <Separator />
        <ScrollArea className="h-40">
          <div className="p-4 space-y-2">
            {allTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${story.id}-${tag}`}
                  checked={story.tags.includes(tag)}
                  onCheckedChange={(checked) => handleTagToggle(tag, !!checked)}
                />
                <Label htmlFor={`tag-${story.id}-${tag}`} className="font-normal">
                  {tag}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <form onSubmit={handleAddNewTag} className="p-4 flex items-center gap-2">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag..."
            className="h-8"
          />
          <Button type="submit" size="icon" className="h-8 w-8 flex-shrink-0 bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
