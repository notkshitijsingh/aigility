'use client';

import { useProjects } from '@/context/project-context';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { FolderKanban, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

function SortableProjectItem({ project }: { project: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: project.id });
    const params = useParams();
    const currentProjectId = useMemo(() => params.id, [params]);
    const { deleteProject } = useProjects();
    const router = useRouter();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const handleDelete = () => {
        deleteProject(project.id);
        if (currentProjectId === project.id) {
            router.push('/dashboard');
        }
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <SidebarMenuItem>
                        <Link href={`/project/${project.id}`} legacyBehavior passHref>
                            <SidebarMenuButton
                                isActive={project.id === currentProjectId}
                                tooltip={project.title}
                            >
                                <FolderKanban />
                                <span>{project.title}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    );
}

export function ProjectList() {
  const { projects, loading, setProjectsOrder } = useProjects();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (loading) {
    return (
      <div className="p-2">
        {[...Array(3)].map((_, i) => (
          <SidebarMenuSkeleton key={i} showIcon />
        ))}
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
        const oldIndex = projects.findIndex((p) => p.id === active.id);
        const newIndex = projects.findIndex((p) => p.id === over?.id);
        const newOrder = arrayMove(projects, oldIndex, newIndex);
        setProjectsOrder(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={projects.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <SidebarMenu>
          {projects.map((project) => (
            <SortableProjectItem key={project.id} project={project} />
          ))}
        </SidebarMenu>
      </SortableContext>
    </DndContext>
  );
}
