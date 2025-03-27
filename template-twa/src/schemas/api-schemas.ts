import { z } from "zod";

/**
 * User schema - represents user data from the API
 */
export const userSchema = z.object({
  id: z.number(),
  username: z.string().optional(),
  firstName: z.string(),
  lastName: z.string().optional(),
  telegramId: z.number(),
  photoUrl: z.string().url().optional(),
  createdAt: z.string().datetime().optional(),
});

/**
 * Error response schema
 */
export const errorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string().optional(),
});

/**
 * Success response schema
 */
export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int(),
  totalPages: z.number().int(),
});

/**
 * Request schemas
 */
export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

/**
 * Types from schemas
 */
export type User = z.infer<typeof userSchema>;
export type ErrorResponse = z.infer<typeof errorSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
