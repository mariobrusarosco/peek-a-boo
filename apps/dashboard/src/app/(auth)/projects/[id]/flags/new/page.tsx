import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/domains/ui-system/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { NewFeatureFlagForm } from '@/domains/feature-flags/components/new-project/new-project-form';
import { fetchProjects } from '@/domains/projects/services/project.service';
import type { Project } from '@peek-a-boo/core';

interface NewFlagPageProps {
  params: {
    id: string;
  };
}

// Server Component for fetching individual project data
async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    const projects = await fetchProjects();
    return projects.find(project => project.id === id) || null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function NewFlagPage({ params }: NewFlagPageProps) {
  const { id: projectId } = params;

  const organizationId = process.env.ORGANIZATION_ID!;
  const project = await fetchProjectById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/projects/${projectId}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {project.name}
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Feature Flag
          </h1>
          <p className="text-gray-500 mt-2">
            Add a new feature flag to control features in your application.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Feature Flag Details
            </h2>
          </div>
          
          <div className="px-6 py-6">
            <NewFeatureFlagForm
              projectId={projectId}
              organizationId={organizationId}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <Link href={`/projects/${projectId}`}>
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}