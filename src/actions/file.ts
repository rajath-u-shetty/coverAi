"use server";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const getFile = async (input: any) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user.id;

  if (!userId) throw new Error("Unauthorized");

  const file = await db.file.findFirst({
    where: {
      userId,
      key: input,
    },
  });

  if (!file) throw new Error("File not found");

  return file;
};

export const letterContent = async (fileId: string, content: string) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user.id;

  if (!userId) throw new Error("Unauthorized");

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

export const getCoverLetter = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user.id;

  if (!userId) throw new Error("Unauthorized");

  const coverLetter = await db.coverLetter.findMany({
    where: {
      userId: userId,
    },
  });

  if (!coverLetter) throw new Error("Cover Letter not found");

  return coverLetter;
};

export const deleteFile = async (input: any) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user.id;

  if (!userId) throw new Error("Unauthorized");

  const file = await db.file.findFirst({
    where: {
      userId,
      key: input,
    },
  });

  if (!file) throw new Error("File not found");

  await db.file.delete({
    where: {
      id: file.id,
    },
  });
};
