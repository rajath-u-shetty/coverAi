import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll("file");
  let fileName = "";
  let parsedText: string = "";

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0];
    console.log("Uploaded file:", uploadedFile);

    if (uploadedFile instanceof File) {
      fileName = uuidv4();
      const tempFilePath = `/tmp/${fileName}.pdf`;
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);

      const parsePDF = (): Promise<string> => {
        return new Promise((resolve, reject) => {
          const pdfParser = new (PDFParser as any)(null, 1);

          pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error(errData.parserError);
            reject(errData.parserError);
          });

          pdfParser.on("pdfParser_dataReady", () => {
            resolve((pdfParser as any).getRawTextContent());
          });

          pdfParser.loadPDF(tempFilePath);
        });
      };

      try {
        parsedText = await parsePDF();
      } catch (error) {
        console.error("Error parsing PDF:", error);
        return new NextResponse("Error parsing PDF", { status: 500 });
      }
    } else {
      console.log("Uploaded file is not in the expected format.");
      return new NextResponse("Invalid file format", { status: 400 });
    }
  } else {
    console.log("No files found.");
    return new NextResponse("No files found", { status: 400 });
  }

  const response = new NextResponse(parsedText);
  response.headers.set("FileName", fileName);
  return response;
}
