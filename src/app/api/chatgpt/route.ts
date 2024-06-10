import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { title, requirements, pdfContent } = await req.json();

    // Construct the OpenAI API request
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "act as a cover letter generator that takes resume of the user as input and the job title and requirements",
        },
        {
          role: "user",
          content: `Job title: ${title}, Requirements: ${requirements}, PDF Content: ${pdfContent}`,
        },
      ],
    });

    // Parse the response from OpenAI
    const completion = response.choices[0].message.content;

    // Return the response as JSON
    return NextResponse.json({ completion });
  } catch (error) {
    console.error("Error in /api/chatgpt:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
}
