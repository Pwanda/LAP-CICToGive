import { z } from "zod";

// Item creation schema
export const createItemSchema = z.object({
  title: z
    .string()
    .min(1, "Titel ist erforderlich")
    .min(3, "Titel muss mindestens 3 Zeichen haben")
    .max(100, "Titel darf maximal 100 Zeichen haben"),
  description: z
    .string()
    .min(1, "Beschreibung ist erforderlich")
    .min(10, "Beschreibung muss mindestens 10 Zeichen haben")
    .max(1000, "Beschreibung darf maximal 1000 Zeichen haben"),
  category: z.string().min(1, "Kategorie ist erforderlich"),
  location: z
    .string()
    .min(1, "Standort ist erforderlich")
    .min(3, "Standort muss mindestens 3 Zeichen haben")
    .max(100, "Standort darf maximal 100 Zeichen haben"),
  condition: z.string().min(1, "Zustand ist erforderlich"),
  images: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files) return true;
      return files.length <= 5;
    }, "Maximal 5 Bilder erlaubt")
    .refine((files) => {
      if (!files) return true;
      return Array.from(files).every((file) => file.size <= 2 * 1024 * 1024);
    }, "Jedes Bild muss kleiner als 2MB sein"),
});

// Item update schema (same as create but with optional images)
export const updateItemSchema = createItemSchema.extend({
  images: z
    .instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files) return true;
      return files.length <= 5;
    }, "Maximal 5 Bilder erlaubt")
    .refine((files) => {
      if (!files) return true;
      return Array.from(files).every((file) => file.size <= 2 * 1024 * 1024);
    }, "Jedes Bild muss kleiner als 2MB sein"),
});

// Comment schema
export const commentSchema = z.object({
  text: z
    .string()
    .min(1, "Kommentar ist erforderlich")
    .min(3, "Kommentar muss mindestens 3 Zeichen haben")
    .max(500, "Kommentar darf maximal 500 Zeichen haben"),
});

// Search schema
export const searchSchema = z.object({
  searchTerm: z.string().optional(),
  selectedCategory: z.string().optional(),
});

// Constants for dropdowns
export const CATEGORIES = [
  "Elektronik",
  "Möbel",
  "Kleidung",
  "Bücher",
  "Sport",
  "Spielzeug",
  "Küche",
  "Garten",
  "Sonstiges",
] as const;

export const CONDITIONS = ["Wie neu", "Gut", "Akzeptabel", "Schlecht"] as const;

// Type exports
export type CreateItemFormData = z.infer<typeof createItemSchema>;
export type UpdateItemFormData = z.infer<typeof updateItemSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type Category = (typeof CATEGORIES)[number];
export type Condition = (typeof CONDITIONS)[number];
