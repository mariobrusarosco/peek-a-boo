'use server'

import { revalidatePath } from 'next/cache'
import { API_ENDPOINTS } from '@/lib/constants/api'
import rollbar from '@/lib/rollbar'
import type { FeatureFlag } from '@peek-a-boo/core'

export type FeatureFlagActionState = {
  success?: boolean
  error?: string
  featureFlag?: FeatureFlag
  message?: string
  timestamp?: string
}

export async function createFeatureFlagAction(
  prevState: FeatureFlagActionState | null,
  formData: FormData
): Promise<FeatureFlagActionState> {
  const name = formData.get('name') as string
  const projectId = formData.get('projectId') as string
  const organizationId = formData.get('organizationId') as string
  const enabled = formData.get('enabled') === 'true'

  // Server-side validation
  if (!name || name.trim().length === 0) {
    return {
      success: false,
      error: 'Feature flag name is required'
    }
  }

  if (name.length < 3) {
    return {
      success: false,
      error: 'Feature flag name must be at least 3 characters long'
    }
  }

  if (name.length > 50) {
    return {
      success: false,
      error: 'Feature flag name cannot exceed 50 characters'
    }
  }

  if (!projectId) {
    return {
      success: false,
      error: 'Project ID is required'
    }
  }

  if (!organizationId) {
    return {
      success: false,
      error: 'Organization ID is required'
    }
  }

  try {
    const response = await fetch(API_ENDPOINTS.FLAGS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: name.trim(),
        projectId,
        organizationId,
        value: { enabled }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      
      console.error('Feature flag API error:', {
        status: response.status,
        statusText: response.statusText,
        responseBody: errorText,
        url: API_ENDPOINTS.FLAGS.CREATE,
        requestData: { name, projectId, organizationId, enabled }
      })

      throw new Error(`Failed to create feature flag: ${response.statusText}`);
    }

    const featureFlag = await response.json()

    rollbar.info('Feature flag created successfully via Server Action', {
      featureFlagId: featureFlag.id,
      featureFlagName: featureFlag.name,
      projectId,
      organizationId,
    })

    // Revalidate the feature flags page cache
    revalidatePath('/feature-flags')
    revalidatePath(`/projects/${projectId}`)
    
    return {
      success: true,
      featureFlag,
      message: `Feature flag "${featureFlag.name}" created successfully!`,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Feature flag creation error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name,
      projectId,
      organizationId,
    })

    throw error
  }
}