import { Controller, Get, Query, Param, BadRequestException } from '@nestjs/common';
import { SdkRuntimeService } from './sdk-runtime.service';
import type { FeatureFlag, Environment } from '@peek-a-boo/core';

@Controller('api/v1')
export class SdkRuntimeController {
  constructor(private readonly sdkRuntimeService: SdkRuntimeService) {}

  @Get('flags')
  async getFlags(
    @Query('projectId') projectId: string,
    @Query('environment') environment: string,
  ): Promise<{ flags: FeatureFlag[]; environment: string }> {
    if (!projectId) {
      throw new BadRequestException('projectId query parameter is required');
    }

    if (!environment) {
      throw new BadRequestException('environment query parameter is required');
    }

    // Validate environment
    const validEnvironments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'];
    const env = environment.toUpperCase();
    if (!validEnvironments.includes(env)) {
      throw new BadRequestException(
        `Invalid environment. Must be one of: ${validEnvironments.join(', ')}`,
      );
    }

    const flags = await this.sdkRuntimeService.getFlagsByEnvironment(
      projectId,
      env as Environment,
    );

    return {
      flags,
      environment: env,
    };
  }

  @Get('flags/:key')
  async getFlag(
    @Param('key') key: string,
    @Query('projectId') projectId: string,
    @Query('environment') environment: string,
  ): Promise<FeatureFlag> {
    if (!projectId) {
      throw new BadRequestException('projectId query parameter is required');
    }

    if (!environment) {
      throw new BadRequestException('environment query parameter is required');
    }

    const validEnvironments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'];
    const env = environment.toUpperCase();
    if (!validEnvironments.includes(env)) {
      throw new BadRequestException(
        `Invalid environment. Must be one of: ${validEnvironments.join(', ')}`,
      );
    }

    const flag = await this.sdkRuntimeService.getFlagByKey(
      projectId,
      key,
      env as Environment,
    );

    if (!flag) {
      throw new BadRequestException(
        `Flag with key "${key}" not found in ${env} environment`,
      );
    }

    return flag;
  }
}
