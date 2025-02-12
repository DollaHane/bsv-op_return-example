import { z } from "zod"

export const uploadValidation = z.object({
  text: z
    .string()
    .max(100, { message: "text cannot be longer than 100 characters" }),
  files: z
    .array(z.instanceof(File))
    .max(1, { message: "Only one file allowed" })
    .optional(),
})

export const backendValidation = z.object({
  text: z
    .string()
    .max(100, { message: "text cannot be longer than 100 characters" }),
  files: z.instanceof(File)
    .optional(),
})

export type UploadValidationRequest = z.infer<typeof uploadValidation>
export type BackendValidationRequest = z.infer<typeof backendValidation>
