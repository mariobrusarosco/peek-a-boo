import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@peek-a-boo/shared';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    // Connect to the database when the module is initialized
    await this.$connect();
    console.log('PrismaService connected to database');
  }

  async onModuleDestroy() {
    // Disconnect from the database when the module is destroyed
    await this.$disconnect();
    console.log('PrismaService disconnected from database');
  }
}