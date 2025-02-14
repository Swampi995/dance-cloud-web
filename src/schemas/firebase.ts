import { DocumentData, DocumentReference } from "firebase/firestore";
import { z } from "zod";

// Create a custom Zod schema for a Firestore DocumentReference.
const DocumentReferenceSchema = z.custom<DocumentReference<DocumentData>>(
  (val) => val instanceof DocumentReference,
  { message: "Expected a Firestore DocumentReference" },
);

export { DocumentReferenceSchema };
