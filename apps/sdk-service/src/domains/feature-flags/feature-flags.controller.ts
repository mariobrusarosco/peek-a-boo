import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeatureFlagsService, CreateFeatureFlagDto } from './feature-flags.service';
import type { FeatureFlag } from '@peek-a-boo/core';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Get(':organizationId')
  async getAllFeatureFlags(@Param('organizationId') organizationId: string): Promise<FeatureFlag[]> {
    return this.featureFlagsService.getAllFeatureFlags(organizationId);
  }


  @Post()
  async createFeatureFlag(@Body() createFeatureFlagDto: CreateFeatureFlagDto): Promise<FeatureFlag> {
    return this.featureFlagsService.createFeatureFlag(createFeatureFlagDto);
  }

  @Get(':id')
  getFeatureFlag(@Param('id') id: string) {
    return this.featureFlagsService.getFeatureFlag(id);
  }
} 