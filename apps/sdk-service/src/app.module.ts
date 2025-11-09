import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FeatureFlagsModule } from '@/domains/feature-flags/feature-flags.module';
import { HealthModule } from './health/health.module';
import { ProjectsModule } from '@/domains/projects/projects.module';
import { SdkRuntimeModule } from '@/domains/sdk-runtime/sdk-runtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FeatureFlagsModule,
    HealthModule,
    ProjectsModule,
    SdkRuntimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 