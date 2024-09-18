import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export const memberSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  role: z.enum(["member", "librarian"], {
    invalid_type_error: "Invalid role selected",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

export const bookSchema = z.object({
  name: z.string().min(1, "Book name is required"),
  author: z.string().min(1, "Author name is required"),
  publisher: z.string().min(1, "Publisher name is required"),
  genre: z.string().min(1, "Genre is required"),
  isbn: z.string().regex(/^(?:\d{10}|\d{13})$/, "Invalid ISBN format"),
  pages: z
    .number()
    .int()
    .positive("Number of pages must be a positive integer"),
  copies: z
    .number()
    .int()
    .positive("Number of copies must be a positive integer"),
  image: z.any().optional(),
});

export type BookFormData = z.infer<typeof bookSchema>;
