// Main barrel file - maintains backward compatibility with existing imports
// All existing imports from @/lib/schemas will continue to work

// Auth schemas
export * from "./auth";

// User schemas
export * from "./users";

// Bank account schemas
export * from "./accounts";

// Credit card schemas
export * from "./credit-cards";

// Category schemas
export * from "./categories";

// Transaction schemas
export * from "./transactions";

// Report schemas
export * from "./reports";

// Base/shared schemas
export * from "./base/api-responses";

// Note: validation helpers are not exported from here as they were not originally exported from schemas.ts
// They are available from "./base/validation-helpers" for internal schema use