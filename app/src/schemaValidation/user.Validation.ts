import { z } from 'zod';

const createSchema = z.object({
  first_name: z.string().min(1, 'first name is required'),
  last_name: z.string().min(1, 'first name is required'),
  email: z.string().email('Invalid email address'),
  age: z.string().optional(),
  password: z.string(),
  profile_picture: z.string().optional(),
  phone_number: z.string(),
  address: z.string().optional()
});

const updateSchema = z.object({
  first_name: z.string().min(1, 'first name is required').optional(),
  last_name: z.string().min(1, 'first name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  age: z.string().optional(),
  password: z.string().optional(),
  profile_picture: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  is_2FA: z.boolean().optional()
});

const loginSchema = z.object({
  email: z.string().email(), // Example: Requires a valid email address
  password: z.string() //.min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/, "Password validation with at least one digit, one lowercase, one uppercase, and one special character"), // Password validation with at least one digit, one lowercase, one uppercase, and one special character
});

export const userSchemaValidation = {
  createSchema, updateSchema, loginSchema
}
