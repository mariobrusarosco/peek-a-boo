import { Module } from '@nestjs/common';
import { SdkRuntimeController } from './sdk-runtime.controller';
import { SdkRuntimeService } from './sdk-runtime.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SdkRuntimeController],
  providers: [SdkRuntimeService],
  exports: [SdkRuntimeService],
})
export class SdkRuntimeModule {}