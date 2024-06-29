"use server";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const getFile = async (input: any) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user.id;

  const file = await db.file.findFirst({
    where: {
      userId,
      key: input,
    },
  });

  if (!file) throw new Error("File not foound");

  return file;
};

export const letterContent = async (fieldId: string, content: string) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const coverLetter = await db.coverLetter.create({
    data: {
      content,
      resumeId: fieldId,
      userId: userId, // Use userId directly instead of user object
    },
  });

  if (!coverLetter) throw new Error("Failed to create cover letter");
  return coverLetter;
};
