import AuthSideBar from './auth-sidebar';
import { fetchProjects } from '@/domains/projects/services/project.service';

export default async function AuthSideBarContainer() {
  const projects = await fetchProjects();
  
  return <AuthSideBar projects={projects} />;
}
