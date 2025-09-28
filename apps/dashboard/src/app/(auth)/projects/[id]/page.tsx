import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/domains/ui-system/components/ui/button';
import { fetchFeatureFlags, fetchProjects } from '@/domains/projects/services/project.service';
import CreateFeatureFlagButton from '@/domains/feature-flags/components/new-project/new-project-button';
import type { FeatureFlag, Project } from '@peek-a-boo/core';

interface ProjectPageProps {
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


export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id: projectId } = params;
  
  // TODO: Refactor these calls
  const organizationId = "cmg2zdg9g000er7qyn92xepc9";
  const project = await fetchProjectById(projectId);
  const featureFlags = await fetchFeatureFlags(projectId, organizationId);

  if (!project) {
    notFound();
  }

  console.log(featureFlags);

  return (
    <div className="container mx-auto py-2">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="text-gray-500 mt-1">
                Project ID: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{project.id}</code>
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Edit Project
              </Button>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Project Name</dt>
                  <dd className="text-sm text-gray-900">{project.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Owner ID</dt>
                  <dd className="text-sm text-gray-900">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{project.userId}</code>
                  </dd>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-500">Feature Flags</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">Active</div>
                    <div className="text-sm text-gray-500">Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Feature Flags</h2>
              <CreateFeatureFlagButton projectId={projectId} size="sm">
                Create Flag
              </CreateFeatureFlagButton>
            </div>
          </div>
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H19a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              {featureFlags && featureFlags.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Feature Flags</h3>
                    <ul>
                      {featureFlags.map((flag) => {
                        return <li key={flag.id}>{flag.name}</li>
                      })}
                    </ul>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No feature flags yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first feature flag to start managing features for this project.
                  </p>
                  <CreateFeatureFlagButton projectId={projectId}>
                    Create Your First Flag
                  </CreateFeatureFlagButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}