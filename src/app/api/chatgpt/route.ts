import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { title, requirements, pdfFile } = await req.json();
  // console.log("in CHATGPT route.ts", pdfFile);

  if (!title || !requirements || !pdfFile) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            `You are an expert in writing professional cover letters.use the information from ${pdfFile} and use the actual information from the user to generate cover Letters. Your task is to generate a compelling and personalized cover letter based on the job title, job requirements, and the user's resume content provided by the user.`,
        },
        {
          role: "user",
          content: `Job Title: ${title}\nJob Requirements: ${requirements}\nResume Content: ${pdfFile}`,
        },
      ],
      stream: true,
    });

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const text = chunk.choices[0].delta?.content || "";
            // console.log(text);
            controller.enqueue(text);
          }
          controller.close();
        },
        cancel() {
          console.log("Stream cancelled");
        },
      }),
      {
        headers: { "Content-Type": "text/plain" },
      },
    );
  } catch (error) {
    console.error("Error in /api/chatgpt:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
