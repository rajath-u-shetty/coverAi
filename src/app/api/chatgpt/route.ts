import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { title, requirements, pdfContent } = await req.json();

  // Set up headers for SSE
  const headers = new Headers();
  headers.append("Content-Type", "text/event-stream");
  headers.append("Cache-Control", "no-cache");
  headers.append("Connection", "keep-alive");

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Construct the OpenAI API request with streaming
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert in writing professional cover letters. Your task is to generate a compelling and personalized cover letter based on the job title, job requirements, and the user's resume content provided by the user.",
            },
            {
              role: "user",
              content: `Job Title: ${title}\nJob Requirements: ${requirements}\nResume Content: ${pdfContent}`,
            },
          ],
          stream: true,
        });

        for await (const chunk of response) {
          const text = chunk.choices[0].delta?.content || "";
          controller.enqueue(`data: ${text}\n\n`);
        }
        controller.close();
      } catch (error) {
        console.error("Error in /api/chatgpt:", error);
        controller.error(error);
      }
    },
    cancel() {
      console.log("Stream canceled");
    },
  });

  return new NextResponse(stream, { headers });
}
