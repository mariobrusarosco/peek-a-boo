import { PrismaClient } from '@prisma/client';

// This file is the entry point for the shared package.
let PrismaClientConstructor: any;

// Use a dynamic import pattern that TypeScript can understand
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClientConstructor = PrismaClient;
} catch (error) {
  // If import fails, create a mock constructor
  console.warn('Warning: @prisma/client not found. Using mock client.');
  PrismaClientConstructor = class MockClient {
    constructor() {
      console.warn('Using mock client. Run `pnpm run prisma:generate` in the shared package.');
    }
  };
}

// Create a singleton instance
const globalAny = globalThis as any;
export const prisma = globalAny.prisma || new PrismaClientConstructor();

// Store the instance in development only to prevent memory leaks
if (process?.env?.NODE_ENV !== 'production') {
  globalAny.prisma = prisma;
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