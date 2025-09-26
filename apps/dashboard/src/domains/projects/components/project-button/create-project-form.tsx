'use client'

import { useActionState } from 'react'
import { Button } from '@/domains/ui-system/components/ui/button'
import { Input } from '@/domains/ui-system/components/ui/input'
import { createProjectAction, type ProjectActionState } from '@/domains/projects/actions/project-actions'
import { useEffect } from 'react'

interface CreateProjectFormProps {
  onSuccess?: () => void
}

export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const [state, formAction, isPending] = useActionState<ProjectActionState | null, FormData>(
    createProjectAction,
    null
  )

  // Handle successful creation
  useEffect(() => {
    if (state?.success && onSuccess) {
      onSuccess()
    }
  }, [state?.success, onSuccess])

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="My Awesome Project"
          disabled={isPending}
          required
          minLength={3}
          maxLength={50}
          className={state?.error ? 'border-red-500' : ''}
          autoFocus
        />
        {state?.error && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {state.error}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="submit" 
          disabled={isPending}
          className="min-w-[120px]"
        >
          {isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </div>

      {state?.success && (
        <div className="text-green-600 text-sm" role="status">
          ✅ Project &quot;{state.project?.name}&quot; created successfully!
        </div>
      )}
    </form>
  )
}