import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { FeatureFlag } from '@peek-a-boo/core';

export interface CreateFeatureFlagDto {
  name: string;
  projectId: string;
  organizationId: string;
  value: Record<string, any>;
}

@Injectable()
export class FeatureFlagsService {
  constructor(private prismaService: PrismaService) {}

  async getFeatureFlag(id: string) {
    // Mock data instead of using PrismaService for now
    return {
      id,
      name: `Feature Flag ${id}`,
      description: 'This is a mock feature flag',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }


  async getAllFeatureFlags(organizationId: string): Promise<FeatureFlag[]> {
    return this.prismaService.featureFlag.findMany({
      where: {
        organizationId
      }
    });
  }

  async createFeatureFlag(data: CreateFeatureFlagDto): Promise<FeatureFlag> {
    return this.prismaService.featureFlag.create({
      data: {
        name: data.name,
        projectId: data.projectId,
        organizationId: data.organizationId,
        value: data.value,
      }
    });
  }
} 