import { API_ENDPOINTS } from "@/lib/constants/api";
import rollbar from "@/lib/rollbar";
import type { FeatureFlag, Project } from "@peek-a-boo/core";

export async function fetchProjects(): Promise<Project[]> {
  const url = API_ENDPOINTS.PROJECTS.LIST;
  
  try {
    const response = await fetch(url, {
      // ✅ Better caching strategy - revalidate every 60 seconds
      next: { revalidate: 60, tags: ['projects'] },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      
      // Log detailed error to Rollbar
      const errorData = {
        url,
        status: response.status,
        statusText: response.statusText,
        responseBody: responseText,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString(),
      };

      rollbar.error('Failed to fetch projects', errorData);
      
      throw new Error(`Failed to fetch projects: ${response.statusText} (${response.status}) from ${response.url}`);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    // Catch any other errors (network issues, JSON parsing, etc.)
    rollbar.error('Fatal error in fetchProjects', {
      url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    throw error;
  }
}


export async function fetchFeatureFlags(organizationId: string): Promise<FeatureFlag[]> {
  const url = API_ENDPOINTS.FLAGS.LIST(organizationId);

  const response = await fetch(url, {
    next: { revalidate: 60, tags: ['feature-flags'] },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    
    // Log detailed error to Rollbar
    const errorData = {
      url,
      status: response.status,
      statusText: response.statusText,
      responseBody: responseText,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: new Date().toISOString(),
    };

    rollbar.error('Failed to fetch feature flags', errorData);
    
    throw new Error(`Failed to fetch feature flags: ${response.statusText} (${response.status}) from ${response.url}`);
  }


  return response.json();
}