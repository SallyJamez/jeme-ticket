import { z } from "zod";

// Mirrors LoginRequestDto { userName, password }
export const loginSchema = z.object({
  userName: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Mirrors: POST /api/Auth/generate-reset-token (raw string body: email)
export const requestResetSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});
export type RequestResetInput = z.infer<typeof requestResetSchema>;

// Mirrors ResetPasswordDto { email, token, newPassword }
export const resetPasswordSchema = z
  .object({
    email: z.string().min(1).email("Enter a valid email"),
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
