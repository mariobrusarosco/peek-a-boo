import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { Project } from '@peek-a-boo/core';
import type { CreateProjectDto } from '@/domains/projects/dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}
  async getAllProjects(): Promise<Project[]> {
    return this.prismaService.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.prismaService.project.findUnique({
      where: {
        id
      }
    });
  }


  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const user = await this.prismaService.user.findFirst();
    
    // ✅ Proper HTTP status: 500 for system configuration issues
    if (!user) {
      throw new InternalServerErrorException('System not properly configured - no users available');
    }
    
    return this.prismaService.project.create({
      data: {
        name: createProjectDto.name,
        userId: user.id
      }
    });
  }

}
