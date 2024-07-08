'use client'
import { useEffect, useState } from "react";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { getCoverLetter } from "@/actions/file"; // updateCoverLetterContent is not used
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePayload } from "@/lib/validator";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CoverLetter } from "@prisma/client";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


type Props = {
  params: {
    id: string
  }
}

const Page = ({ params }: Props) => {
  const { id } = params;
  const [value, setValue] = useState<string>("");
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const coverLetter = await getCoverLetter(id);
      //console.log(coverLetter.content);
      setValue(coverLetter.content.toString());
    }
    getData();
  }, [id]);

  const mutation = useMutation({
    mutationFn: async ({ id, content }: { id: string, content: string }) => {
      const payload: UpdatePayload = { id: id, content: content };
      //console.log("payload", payload);
      await axios.patch(`/api/history/${id}`, payload);
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 409) {
        return toast({
          title: "File does not exist",
          description: "Please choose another name",
          variant: "destructive",
        });
      } else if (err.response?.status === 401) {
        router.push("/sign-in");
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "File updated",
        description: "The file has been updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries(["coverLetter"]);
    },
  });

  const handleDownload = async (id: string) => {

    const letter = await getCoverLetter(id);

    try {
      // Create a new div to hold the content
      const content = document.createElement('div');
      content.innerHTML = letter.content;

      // Apply styling to ensure proper rendering
      content.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 210mm;
      padding: 20mm;
      font-family: Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      background-color: #fff;
    `;

      // Append the content to the body
      document.body.appendChild(content);

      // Wait for any potential asynchronous rendering
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate the canvas with improved settings
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create the PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width / 2; // Scaling down due to canvas scaling
      const imgHeight = canvas.height / 2; // Scaling down due to canvas scaling

      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
      heightLeft -= pdfHeight;

      // Handle multi-page PDF only if heightLeft is greater than 0
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        if (position < -pdfHeight) break; // Exit loop if there are no more content to add

        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
        heightLeft -= pdfHeight;
      }

      // Save the PDF
      const filename = letter.fileName.split('.')[0];
      pdf.save(`${filename}.pdf`);

      // Clean up
      document.body.removeChild(content);

    } catch (error) {
      // Error handling
      console.error('Error generating PDF:', error);
      toast({
        title: 'Failed to download',
        description: 'An error occurred while generating the PDF. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  if (!value) return <div className="flex justify-center items-center h-screen w-screen">
    <span className="loader" />
  </div>;

  return (
    <main className='mx-auto max-w-7xl md:p-10 '>
      <div className='mt-8 items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent'>History</h1>
      </div>
      <MinimalTiptapEditor
        value={value}
        onValueChange={setValue}
        outputValue="html"
        disabled={false}
        contentClass="mx-auto mt-6"
      />
      <div className="bottom-0 right-9 flex flex-row justify-end gap-4">
        <Button
          onClick={() => mutation.mutate({ id, content: value })}
          className="mt-6 w-24 bg-gradient-to-r from-cyan-600 via-sky-500 to-green-500 hover:bg-gradient-to-r hover:from-green-600 hover:via-sky-500 hover:to-cyan-500 ease-in-out">
          Update
        </Button>
        <Button
          onClick={() => handleDownload(id)}
          className="mt-6 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-sky-600 hover:to-cyan-500 ease-in-out">
          Download
        </Button>
      </div>
    </main>
  );
}

export default Page;

