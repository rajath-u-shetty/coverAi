"use client";
import { ReactElement, useState } from "react";
import { z } from "zod";

export const formSchema = z.object({
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

export function useMultiStepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((prev) => {
      if (prev >= steps.length - 1) return prev;
      return prev + 1;
    });
  }

  function back() {
    setCurrentStepIndex((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    goTo,
    next,
    back,
    steps,
  };
}
