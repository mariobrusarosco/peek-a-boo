import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { FeatureFlag, Environment } from '@peek-a-boo/core';

@Injectable()
export class SdkRuntimeService {
  constructor(private prismaService: PrismaService) {}

  async getFlagsByEnvironment(
    projectId: string,
    environment: Environment,
  ): Promise<FeatureFlag[]> {
    return this.prismaService.featureFlag.findMany({
      where: {
        projectId,
        environment,
      },
      select: {
        id: true,
        key: true,
        name: true,
        description: true,
        enabled: true,
        value: true,
        environment: true,
        projectId: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getFlagByKey(
    projectId: string,
    key: string,
    environment: Environment,
  ): Promise<FeatureFlag | null> {
    return this.prismaService.featureFlag.findFirst({
      where: {
        projectId,
        key,
        environment,
      },
    });
  }
}