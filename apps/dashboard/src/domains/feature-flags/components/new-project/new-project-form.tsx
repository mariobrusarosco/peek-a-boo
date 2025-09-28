'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/domains/ui-system/components/ui/button'
import { Input } from '@/domains/ui-system/components/ui/input'
import { Switch } from '@/domains/ui-system/components/ui/switch'
import { createFeatureFlagAction, type FeatureFlagActionState } from '@/domains/feature-flags/actions/features-flag.actions'
import { useEffect, useState } from 'react'

interface NewFeatureFlagFormProps {
  projectId: string
  organizationId: string
  onSuccess?: () => void
}

export function NewFeatureFlagForm({ projectId, organizationId, onSuccess }: NewFeatureFlagFormProps) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(true)
  const [state, formAction, isPending] = useActionState<FeatureFlagActionState | null, FormData>(
    createFeatureFlagAction,
    null
  )

  // Handle successful creation
  useEffect(() => {
    if (state?.success) {
      if (onSuccess) {
        onSuccess()
      } 
    }
  }, [state?.success, onSuccess, router, projectId])

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="enabled" value={enabled.toString()} />
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Feature Flag Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="my-awesome-feature"
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

      <div className="flex items-center space-x-2">
        <Switch
          id="enabled"
          checked={enabled}
          onCheckedChange={setEnabled}
          disabled={isPending}
        />
        <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
          Enable feature flag
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="submit" 
          disabled={isPending}
          className="min-w-[120px]"
        >
          {isPending ? 'Creating...' : 'Create Feature Flag'}
        </Button>
      </div>

      {state?.success && (
        <div className="text-green-600 text-sm" role="status">
          ✅ Feature flag &quot;{state.featureFlag?.name}&quot; created successfully!
        </div>
      )}
    </form>
  )
}