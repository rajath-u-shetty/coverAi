"use client";
import { ReactElement, useState } from "react";
import { z } from "zod";

export const formValidator = z.object({
  // Enter job title
  // Paste or type the title of the job you're applying for.

  // Add job details
  // Paste or type the responsibilities and requirements listed in the job description.
  // RESPONSIBILITIES - some ponits
  // MIniMUM Qualifications

  pdfFile: z.string().url({ message: "PDF file URL is required" }),
  title: z.string().min(1, { message: "Add the title or position" }),
  requirements: z.string().min(1, {
    message: "Paste or type the requirements listed in the job description",
  }),
});

export type FormCreationPayload = z.infer<typeof formValidator>;
