import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { FeatureFlag } from '@peek-a-boo/core';

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
} 