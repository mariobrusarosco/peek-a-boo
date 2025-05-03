import ProjectList from './project-list';
import { fetchProjects } from '@/domains/projects/services/project.service';

export default async function ProjectListContainer() {
  // Server-side data fetching
  const projects = await fetchProjects();
  
  if (projects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-40">
        <p className="text-gray-500 mb-4">No projects found</p>
        <p className="text-sm text-gray-400">Create your first project using the button above</p>
      </div>
    );
  }
  
  return <ProjectList projects={projects} />;
}


