import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Benutzername ist erforderlich")
    .min(3, "Benutzername muss mindestens 3 Zeichen haben")
    .max(50, "Benutzername darf maximal 50 Zeichen haben"),
  password: z
    .string()
    .min(1, "Passwort ist erforderlich")
    .min(6, "Passwort muss mindestens 6 Zeichen haben")
    .max(100, "Passwort darf maximal 100 Zeichen haben"),
});

// Register schema
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Benutzername ist erforderlich")
      .min(3, "Benutzername muss mindestens 3 Zeichen haben")
      .max(50, "Benutzername darf maximal 50 Zeichen haben")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten",
      ),
    email: z
      .string()
      .min(1, "E-Mail ist erforderlich")
      .email("Bitte geben Sie eine gültige E-Mail-Adresse ein")
      .max(255, "E-Mail darf maximal 255 Zeichen haben"),
    password: z
      .string()
      .min(1, "Passwort ist erforderlich")
      .min(6, "Passwort muss mindestens 6 Zeichen haben")
      .max(100, "Passwort darf maximal 100 Zeichen haben"),
    confirmPassword: z.string().min(1, "Bitte bestätigen Sie Ihr Passwort"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
