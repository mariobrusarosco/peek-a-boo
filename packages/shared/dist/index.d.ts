import { PrismaClient } from '.prisma/client';
export * from '.prisma/client';
declare global {
    var prisma: PrismaClient | undefined;
}
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client/runtime/library").DefaultArgs>;
export interface FlagContext {
    userId?: string;
    sessionId?: string;
    deviceId?: string;
    ip?: string;
    userAgent?: string;
    country?: string;
    language?: string;
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
    ruleId?: string;
}
export interface SDKOptions {
    apiKey: string;
    environmentKey: string;
    pollingInterval?: number;
    bootstrap?: Record<string, FlagEvaluationResponse>;
    enableLogs?: boolean;
    defaultFlagValues?: Record<string, any>;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
    };
}
