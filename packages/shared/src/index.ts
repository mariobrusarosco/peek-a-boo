import { PrismaClient } from '@prisma/client';

// Export types and enums from Prisma
export * from '@prisma/client';

// Create a singleton Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export types and interfaces for the feature flag system

// Flag context used for targeting
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

// Response from flag evaluation
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

// SDK initialization options
export interface SDKOptions {
  apiKey: string;
  environmentKey: string;
  pollingInterval?: number; // in milliseconds
  bootstrap?: Record<string, FlagEvaluationResponse>;
  enableLogs?: boolean;
  defaultFlagValues?: Record<string, any>;
}

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
} 