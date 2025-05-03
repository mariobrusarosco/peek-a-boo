import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from '@/domains/projects/projects.service';
import type { Project } from '@peek-a-boo/shared/node_modules/.prisma/client';
import type { CreateProjectDto } from '@/domains/projects/dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project | { error: string }> {
    const project = await this.projectsService.getProjectById(id);
    
    if (!project) {
      return { error: 'Project not found' };
    }
    
    return project;
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }
}
