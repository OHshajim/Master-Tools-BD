
// Legacy dataTypes.ts - now just re-exports from the new modular structure
// This file is kept for backward compatibility
export * from './index';

// Re-export specific types that are commonly used
export type { NotificationPriority, NotificationTargetType } from './notification';
export type { DurationType } from './plan';
