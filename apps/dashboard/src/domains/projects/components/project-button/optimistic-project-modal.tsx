'use client';

import { useActionState, useOptimistic, useCallback } from 'react';
import { Button } from '@/domains/ui-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/domains/ui-system/components/ui/dialog';
import { Input } from '@/domains/ui-system/components/ui/input';
import { createProjectAction, type ProjectActionState } from '@/domains/projects/actions/project-actions';
import type { Project } from '@peek-a-boo/core';

interface OptimisticProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onOptimisticAdd: (project: Project) => void;
}

export default function OptimisticProjectModal({
  isOpen,
  onClose,
  projects,
  onOptimisticAdd,
}: OptimisticProjectModalProps) {
  // ✅ useActionState for server action management
  const [state, formAction, isPending] = useActionState<ProjectActionState | null, FormData>(
    createProjectAction,
    null
  );

  // ✅ useOptimistic for instant UI updates
  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    projects,
    (state: Project[], newProject: Project) => [...state, newProject]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // ✅ Enhanced form action with optimistic updates
  const optimisticFormAction = async (formData: FormData) => {
    const name = formData.get('name') as string;
    
    // 🚀 Instant UI update - no waiting for server!
    const optimisticProject: Project = {
      id: `temp-${Date.now()}`, // Temporary ID
      name: name.trim(),
      userId: 'temp-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to optimistic state immediately
    addOptimisticProject(optimisticProject);
    onOptimisticAdd(optimisticProject);

    // Now run the actual server action
    await formAction(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={optimisticFormAction}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project. Watch the optimistic update!
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="My Awesome Project"
                  className={state?.error ? 'border-red-500' : ''}
                  disabled={isPending}
                  required
                  minLength={3}
                  maxLength={50}
                  autoFocus
                />
                {state?.error && (
                  <p className="text-red-500 text-sm mt-1" role="alert">
                    {state.error}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Optimistic projects preview */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Projects ({optimisticProjects.length}):
            </p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {optimisticProjects.slice(-3).map((project) => (
                <div 
                  key={project.id}
                  className={`text-xs p-2 rounded border ${
                    project.id.startsWith('temp-') 
                      ? 'bg-blue-50 border-blue-200 text-blue-800' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {project.id.startsWith('temp-') && '⚡ '}{project.name}
                  {project.id.startsWith('temp-') && ' (optimistic)'}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Success message */}
          {state?.success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-sm text-green-700">
                    ✅ Server confirmed: &quot;{state.project?.name}&quot; created!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirming...
                </>
              ) : (
                'Create Project ⚡'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}