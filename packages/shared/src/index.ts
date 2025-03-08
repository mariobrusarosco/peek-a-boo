import { PrismaClient } from '@prisma/client';

// Export types and enums from Prisma
export * from '@prisma/client';

// Create a singleton Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Export helper types for usage throughout the application
export interface FlagContext {
  userId?: string;
  sessionId?: string;
  deviceId?: string;
  ip?: string;
  userAgent?: string;
  country?: string;
  language?: string;
  // Add any other attributes that can be used for targeting
  [key: string]: any;
}

export interface FlagEvaluationResponse {
  key: string;
  enabled: boolean;
  value: any;
  variation?: {
    id: string;
    name?: string;
  };
  source: 'RULE' | 'DEFAULT' | 'ERROR';
  // If the flag is evaluated by a rule, this will contain the rule ID
  ruleId?: string;
}

// Types for SDK initialization
export interface SDKOptions {
  apiKey: string;
  environmentKey: string;
  pollingInterval?: number; // in milliseconds
  bootstrap?: Record<string, FlagEvaluationResponse>;
  enableLogs?: boolean;
  defaultFlagValues?: Record<string, any>;
}

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
} 