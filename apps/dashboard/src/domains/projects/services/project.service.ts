import { API_ENDPOINTS } from "@/lib/constants/api";
import type { Project } from "@peek-a-boo/core";

export async function fetchProjects(): Promise<Project[]> {
  const url = API_ENDPOINTS.PROJECTS.LIST;
  
  console.log('FETCH PROJECTS URL:', url);
  
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log('RESPONSE STATUS:', response.status);
  console.log('RESPONSE URL:', response.url);
  console.log('RESPONSE OK:', response.ok);

  if (!response.ok) {
    const responseText = await response.text();
    console.log('ERROR RESPONSE BODY:', responseText);
    throw new Error(`Failed to fetch projects: ${response.statusText} (${response.status}) from ${response.url}`);
  }

  return response.json();
}
