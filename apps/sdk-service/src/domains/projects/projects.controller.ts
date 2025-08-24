import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from '@/domains/projects/projects.service';
import type { Project } from '@peek-a-boo/core';
import type { CreateProjectDto } from '@/domains/projects/dto/create-project.dto';
import { ProjectErrors } from '@/domains/projects/errors';
import type { ApiError } from '@/domains/global/typing/api-error';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project | ApiError> {
    const project = await this.projectsService.getProjectById(id);
    
    if (!project) {
      return ProjectErrors.NOT_FOUND
    }
    
    return project;
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }
}
