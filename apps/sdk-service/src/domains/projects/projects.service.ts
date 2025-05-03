import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { Project } from '@peek-a-boo/shared/node_modules/.prisma/client';
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
    
    if (!user) {
      throw new NotFoundException('No users found in the system');
    }
    
    return this.prismaService.project.create({
      data: {
        name: createProjectDto.name,
        userId: user.id
      }
    });
  }

}
