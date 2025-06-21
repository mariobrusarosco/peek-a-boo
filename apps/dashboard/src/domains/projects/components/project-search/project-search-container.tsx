import { ProjectSearch } from "./project-search"
import { fetchProjects } from "@/domains/projects/services/project.service"

export default async function ProjectSearchContainer() {
    const projects = await fetchProjects();
  
  return <ProjectSearch projects={projects} />
}
