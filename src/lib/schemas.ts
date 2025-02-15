import { z } from 'zod';

// Auth schemas
export const signupSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: z.string()
    .email('Invalid email address')
    .max(50, 'Email cannot exceed 50 characters'),
  username: z.string()
    .max(20, 'Username cannot exceed 20 characters')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(40, 'Password cannot exceed 40 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
      'Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character'
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const signinSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

// Domain schemas
export const animalSchema = z.object({
  id: z.number().optional(),
  sex: z.enum(['MALE', 'FEMALE'], {
    errorMap: () => ({ message: 'Sex must be either MALE or FEMALE' })
  }),
  name: z.string().optional(),
  animalSpecies: z.enum(['CAT', 'DOG'], {
    errorMap: () => ({ message: 'Species must be either CAT or DOG' })
  }),
  breed: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  microchip: z.number().optional(),
  healthStatus: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  lastModifiedBy: z.string().optional(),
  lastModifiedAt: z.string().datetime().optional()
});

export const animalHealthCheckSchema = z.object({
  id: z.number().optional(),
  created: z.string().datetime(),
  description: z.string(),
  animalId: z.number()
});

export const citizenSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.number().optional(),
  city: z.string().optional()
});

export const userProfileSchema = z.object({
  id: z.number().optional(),
  citizen: citizenSchema,
  animals: z.array(animalSchema).optional()
});

// Type exports
export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;
export type Animal = z.infer<typeof animalSchema>;
export type AnimalFormData = z.infer<typeof animalSchema>;
export type AnimalHealthCheck = z.infer<typeof animalHealthCheckSchema>;
export type AnimalHealthCheckFormData = z.infer<typeof animalHealthCheckSchema>;
export type Citizen = z.infer<typeof citizenSchema>;
export type CitizenFormData = z.infer<typeof citizenSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;