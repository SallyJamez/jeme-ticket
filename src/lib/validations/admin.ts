import { z } from "zod";

// Mirrors CreateSuperAdminDto
export const createSuperAdminSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().min(1).email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type CreateSuperAdminInput = z.infer<typeof createSuperAdminSchema>;

// Mirrors CreateStaffDto { firstName, lastName, department, email }
export const createStaffSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().min(1).max(100),
  department: z.string().min(1, "Department is required"),
  email: z.string().min(1).email(),
});
export type CreateStaffInput = z.infer<typeof createStaffSchema>;

// Mirrors UpdateStaffDto { firstName, lastName, department }
export const updateStaffSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().min(1).max(100),
  department: z.string().min(1, "Department is required"),
});
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;

// Mirrors CreateClientDto
export const createClientSchema = z.object({
  companyName: z.string().min(1).max(250),
  companyAddress: z.string().min(1).max(250),
  companyEmail: z.string().min(1).email(),
  adminFirstName: z.string().min(1).max(100),
  adminLastName: z.string().min(1).max(100),
  adminEmail: z.string().min(1).email(),
});
export type CreateClientInput = z.infer<typeof createClientSchema>;

// Mirrors CreateSubUserDto { firstName, lastName, email }
export const createSubUserSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().min(1).email(),
});
export type CreateSubUserInput = z.infer<typeof createSubUserSchema>;
