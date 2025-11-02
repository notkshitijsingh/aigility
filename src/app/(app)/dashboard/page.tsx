'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/context/project-context';
import type { Project } from '@/context/project-context';
import { AddProjectModal } from '@/components/add-project-modal';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { projects, addProject, loading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProject = (newProjectData: Omit<Project, 'id' | 'stories' | 'userId'>) => {
    addProject(newProjectData);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Project
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id} className="group">
                <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:border-primary">
                  <CardHeader>
                    <CardTitle className="font-headline group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{project.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
            <p className="text-muted-foreground mb-4">Get started by creating your first project.</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
        )}
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
