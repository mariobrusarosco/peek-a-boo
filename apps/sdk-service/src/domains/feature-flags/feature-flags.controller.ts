import { Controller, Get, Param } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';
import type { FeatureFlag } from '@peek-a-boo/core';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Get(':organizationId')
  async getAllFeatureFlags(@Param('organizationId') organizationId: string): Promise<FeatureFlag[]> {
    return this.featureFlagsService.getAllFeatureFlags(organizationId);
  }


  @Get(':id')
  getFeatureFlag(@Param('id') id: string) {
    return this.featureFlagsService.getFeatureFlag(id);
  }
} 