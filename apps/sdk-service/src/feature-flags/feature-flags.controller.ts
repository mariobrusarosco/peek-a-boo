import { Controller, Get, Param } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Get()
  getHello(): string {
    return 'Hello World from Feature Flags Service!';
  }

  @Get(':id')
  getFeatureFlag(@Param('id') id: string) {
    return this.featureFlagsService.getFeatureFlag(id);
  }
} 