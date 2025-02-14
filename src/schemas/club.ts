import { z } from "zod";
import { GeoPoint } from "firebase/firestore";

export const ClubSchema = z.object({
  id: z.string(),
  website: z.string().optional(),
  name: z.string(),
  logoURL: z.string().optional(),
  logoBlurhas: z.string().optional(),
  backgroundURL: z.string().optional(),
  blurhash: z.string().optional(),
  city: z.string(),
  address: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  description: z.string().optional(),
  admins: z.array(z.string()),
  allowRegistration: z.boolean().optional(),
  coordinates: z.instanceof(GeoPoint).optional(),
});

export type ClubType = z.infer<typeof ClubSchema>;
