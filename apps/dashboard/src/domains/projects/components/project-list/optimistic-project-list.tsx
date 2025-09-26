'use client';

import { useOptimistic, useState } from 'react';
import { Button } from '@/domains/ui-system/components/ui/button';
import OptimisticProjectModal from '../project-button/optimistic-project-modal';
import type { Project } from '@peek-a-boo/core';

interface OptimisticProjectListProps {
  initialProjects: Project[];
}

export default function OptimisticProjectList({ initialProjects }: OptimisticProjectListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ useOptimistic hook - the star of React 19
  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    initialProjects,
    (state: Project[], newProject: Project) => {
      // Remove any existing temp project with same name to avoid duplicates
      const filtered = state.filter(p => !(p.id.startsWith('temp-') && p.name === newProject.name));
      return [...filtered, newProject];
    }
  );

  const handleOptimisticAdd = (project: Project) => {
    addOptimisticProject(project);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-600">
            {optimisticProjects.length} projects • React 19 Optimistic Updates Demo
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          ⚡ Create Project (Optimistic)
        </Button>
      </div>

      {/* Projects Grid with Optimistic States */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {optimisticProjects.length === 0 ? (
          <div className="col-span-full flex flex-col justify-center items-center h-40">
            <p className="text-gray-500 mb-4">No projects found</p>
            <p className="text-sm text-gray-400">
              Create your first project using the button above
            </p>
          </div>
        ) : (
          optimisticProjects.map((project) => {
            const isOptimistic = project.id.startsWith('temp-');
            
            return (
              <div
                key={project.id}
                className={`
                  relative p-6 rounded-lg border transition-all duration-200
                  ${isOptimistic 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 animate-pulse' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {/* Optimistic Badge */}
                {isOptimistic && (
                  <div className="absolute -top-2 -right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      ⚡ Pending
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${isOptimistic ? 'text-blue-900' : 'text-gray-900'}`}>
                      {project.name}
                    </h3>
                    
                    <p className={`text-sm mt-1 ${isOptimistic ? 'text-blue-600' : 'text-gray-500'}`}>
                      {isOptimistic ? (
                        <>⚡ Creating... (Optimistic UI)</>
                      ) : (
                        <>Created {new Date(project.createdAt).toLocaleDateString()}</>
                      )}
                    </p>

                    <div className="mt-3 text-xs">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                        isOptimistic 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {isOptimistic ? '🔄 Syncing...' : '✅ Synced'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loading overlay for optimistic items */}
                {isOptimistic && (
                  <div className="absolute inset-0 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm font-medium">Saving...</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Performance Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">🧠 React 19 Optimistic Updates</h3>
        <div className="text-sm text-purple-700 space-y-1">
          <p>• <strong>Instant UI:</strong> Projects appear immediately when created</p>
          <p>• <strong>Smart Reconciliation:</strong> Server response replaces optimistic state</p>
          <p>• <strong>Error Handling:</strong> Optimistic updates roll back on failure</p>
          <p>• <strong>Better UX:</strong> No loading spinners, feels native</p>
        </div>
      </div>

      <OptimisticProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={optimisticProjects}
        onOptimisticAdd={handleOptimisticAdd}
      />
    </div>
  );
}