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

  const file = await db.file.findUnique({
    where: {
      userId: userId,
      id: fileId
    }
  })

  if (!file) throw new Error("File not found");

  try {
    let uniqueFileName = file.name;
    let fileExists = await db.file.findFirst({
      where: {
        name: uniqueFileName,
        id: fileId
      }
    });

    while (fileExists) {
      uniqueFileName = `${file.name}-${Date.now()}`;
      fileExists = await db.file.findFirst({
        where: { name: uniqueFileName }
      });
    }

    const newCoverLetter = await db.coverLetter.create({
      data: {
        userId: userId,
        resumeId: fileId,
        content: content,
        fileName: file.name,
      },
    });
    if (!newCoverLetter) throw new Error("Failed to create cover letter");

    return newCoverLetter;
  } catch (error) {

    console.log(error);
    throw new Error("Failed to create cover letter");
  }
};

export const getCoverLetter = async (id: string) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user.id;

  if (!userId) throw new Error("Unauthorized");

  const coverLetter = await db.coverLetter.findFirst({
    where: {
      userId: userId,
      id: id
    }
  })

  if (!coverLetter) throw new Error("Cover Letter not found");

  return coverLetter;
};

export const updateCoverLetterContent = async (id: string, content: string) => {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session?.user.id;

  if (!userId) throw new Error("Unauthorized");

  const coverLetter = await db.coverLetter.findFirst({
    where: {
      userId: userId,
      id: id
    }
  })

  if (!coverLetter) throw new Error("Cover Letter not found");

  try {
    await db.coverLetter.update({
      where: {
        id: id
      },
      data: {
        content: content
      }
    })
    return coverLetter;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update cover letter");
  }
};
