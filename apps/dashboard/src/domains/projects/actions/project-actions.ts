'use server'

import { revalidatePath } from 'next/cache'
import { API_ENDPOINTS } from '@/lib/constants/api'
import rollbar from '@/lib/rollbar'
import type { Project } from '@peek-a-boo/core'

export type ProjectActionState = {
  success?: boolean
  error?: string
  project?: Project
  message?: string
  timestamp?: string
}

export async function createProjectAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  const name = formData.get('name') as string

  // Server-side validation
  if (!name || name.trim().length === 0) {
    return {
      success: false,
      error: 'Project name is required'
    }
  }

  if (name.length < 3) {
    return {
      success: false,
      error: 'Project name must be at least 3 characters long'
    }
  }

  if (name.length > 50) {
    return {
      success: false,
      error: 'Project name cannot exceed 50 characters'
    }
  }

  try {
    const response = await fetch(API_ENDPOINTS.PROJECTS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name.trim() }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      
      rollbar.error(new Error(`Failed to create project via Server Action: ${response.statusText}`), {
        url: API_ENDPOINTS.PROJECTS.CREATE,
        status: response.status,
        statusText: response.statusText,
        responseBody: errorText,
        projectName: name,
        custom: {
          apiEndpoint: API_ENDPOINTS.PROJECTS.CREATE,
          httpStatus: response.status,
          httpStatusText: response.statusText,
          apiResponse: errorText,
          requestedProjectName: name,
        }
      })

      throw new Error(`Failed to create project: ${response.statusText}`);

    }

    const project = await response.json()

    rollbar.info('Project created successfully via Server Action', {
      projectId: project.id,
      projectName: project.name,
    })

    // Revalidate the projects page cache
    revalidatePath('/projects')
    
    // ✅ Enhanced response for optimistic updates
    return {
      success: true,
      project,
      message: `Project "${project.name}" created successfully!`,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    rollbar.error('Fatal error in createProjectAction', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      projectName: name,
    })

    throw error;
  }
}