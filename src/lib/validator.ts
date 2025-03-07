import { z } from "zod";

export const formValidator = z
  .object({
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters" }),
    requirements: z
      .string()
      .min(10, { message: "Requirements must be at least 10 characters" }),
    pdfFile: z.string().nonempty({ message: "PDF file is required" }),
  })
  .required();

export type FormCreationPayload = z.infer<typeof formValidator>;

export const deleteValidator = z.object({
  fileId: z.string({ message: "File ID is required" }),
});

export type DeletePayload = z.infer<typeof deleteValidator>;

export const updateValidator = z.object({
  id: z.string({ message: "File ID is required" }),
  content: z.string({ message: "Content is required" }),
});

export type UpdatePayload = z.infer<typeof updateValidator>;

