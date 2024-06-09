import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFile = formData.get("file");

  if (!uploadedFile || !(uploadedFile instanceof File)) {
    console.log("Uploaded file is not in the expected format.");
    return new NextResponse("Uploaded file is not in the expected format.", {
      status: 400,
    });
  }

  const fileName = uuidv4();
  const tempFilePath = `/tmp/${fileName}.pdf`;

  // Convert ArrayBuffer to Buffer
  const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

  // Save the buffer as a file
  await fs.writeFile(tempFilePath, fileBuffer);

  let parsedText = "";

  // Parse the pdf using pdf2json
  const pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", (errData) =>
    console.error(errData.parserError),
  );
  pdfParser.on("pdfParser_dataReady", () => {
    parsedText = pdfParser.getRawTextContent();
  });

  await new Promise((resolve) => {
    pdfParser.loadPDF(tempFilePath);
    pdfParser.on("pdfParser_dataReady", resolve);
  });

  const response = new NextResponse(parsedText);
  response.headers.set("FileName", fileName);
  return response;
}
