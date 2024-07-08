import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteValidator } from "@/lib/validator";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session?.user.id;

  if (!userId) throw new Error("Unauthorized");
  try {
    const coverLetter = await db.coverLetter.findMany({
      where: {
        userId: userId,
      },
    });

    if (!coverLetter) throw new Error("Cover Letter not found");

    return new Response(JSON.stringify(coverLetter), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) { }
}

export async function PATCH(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!session?.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileId } = deleteValidator.parse(body);

    const userId = session?.user.id;
    const coverLetter = await db.coverLetter.findFirst({
      where: {
        userId: userId,
        id: fileId,
      },
    });

    if (!coverLetter) {
      return new Response("Cover Letter not found", { status: 404 });
    }

    await db.coverLetter.delete({
      where: {
        id: fileId,
        userId: userId,
      },
    });

    return new Response("Cover Letter deleted", { status: 200 });
  } catch (error: any) {
    console.error("Error deleting cover letter:", error.message);
    return new Response(error.message, { status: 400 });
  }
}  
