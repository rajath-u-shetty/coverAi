import { db } from "@/lib/db";
import { updateValidator } from "@/lib/validator";

export async function PATCH(req: Request, res: Response) {

  const body = await req.json();
  //console.log("body", body);
  const { id, content } = updateValidator.parse(body);

  try {
    const coverLetter = await db.coverLetter.update({
      where: {
        id: id,
      },
      data: {
        content: content,
      }
    })
    return new Response(JSON.stringify(coverLetter), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
