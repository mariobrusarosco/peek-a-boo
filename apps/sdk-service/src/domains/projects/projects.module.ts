import { Module } from '@nestjs/common';
import { ProjectsController } from '@/domains/projects/projects.controller';
import { ProjectsService } from '@/domains/projects/projects.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
