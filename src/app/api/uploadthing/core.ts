import { getAuthSession } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async() => {

  const session = await getAuthSession();

  if(!session?.user){
    throw new UploadThingError("UnAuthorized") 
  }
  return {userId: session.user.id};
}

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
  .middleware(()=> handleAuth())
  .onUploadComplete((data) => console.log(data))
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;


