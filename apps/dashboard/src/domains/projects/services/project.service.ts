import { API_ENDPOINTS } from '@/lib/constants/api';
import type { Project } from "@peek-a-boo/shared/node_modules/.prisma/client";

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(API_ENDPOINTS.PROJECTS.LIST, {
    cache: 'no-store', // Don't cache as we want fresh data
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }
  
  return response.json();
}
