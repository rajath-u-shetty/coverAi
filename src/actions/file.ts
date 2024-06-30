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

export const letterContent = async (fileId: string, content: string) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const userId = session?.user.id;
  console.log(session);

  const existingCoverLetter = await db.coverLetter.findFirst({
    where: {
      resumeId: fileId,
      userId: userId,
    },
  });

  if (existingCoverLetter) {
    throw new Error("Cover Letter for this already exists");
  }
  try {
    const newCoverLetter = await db.coverLetter.create({
      data: {
        userId: userId,
        resumeId: fileId,
        content: content,
      },
    });

    if (!newCoverLetter) throw new Error("Failed to create cover letter");

    return newCoverLetter;
  } catch (error) {
    throw new Error("Failed to create cover letter");
  }
};
