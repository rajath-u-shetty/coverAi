import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UploadStatus } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new UploadThingError("UnAuthorized");
  }
  return { userId: session?.user.id };
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ file, metadata }) => {
      console.log(file);
      const fileName = await db.file.create({
        data: {
          key: file.key,
          url: file.url,
          userId: metadata.userId,
          name: file.name,
          uploadStatus: "SUCCESSFUL",
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
