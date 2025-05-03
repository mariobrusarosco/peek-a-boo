import { ProjectSearch } from "./project-search"
import type { Project } from "@peek-a-boo/shared/node_modules/.prisma/client"
import { fetchProjects } from "@/domains/projects/services/project.service"

export default async function ProjectSearchContainer() {
    const projects = await fetchProjects();
  
  return <ProjectSearch projects={projects} />
}
