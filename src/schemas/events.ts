import { z } from "zod";

import { DocumentReferenceSchema } from "./firebase";
import { GeoPoint, Timestamp } from "firebase/firestore";

export const ClubEventSchema = z.object({
  id: z.string(),
  name: z.string(),
  club: DocumentReferenceSchema,
  startDate: z.instanceof(Timestamp),
  endDate: z.instanceof(Timestamp),
  address: z.string(),
  location: z.string().optional(),
  backgroundURL: z.string(),
  blurhash: z.string(),
  maxParticipants: z.number().or(z.string()),
  allowRegistration: z.boolean(),
  admins: z.array(z.string()),
  description: z.string(),
  coordinated: z.instanceof(GeoPoint).optional(),
});

export type ClubEventType = z.infer<typeof ClubEventSchema>;
