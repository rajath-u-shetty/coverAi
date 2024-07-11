"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import UploadDropzone from "./UploadDropzone";
import { Textarea } from "./ui/textarea";
import { Button, buttonVariants } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Copy, Edit } from "lucide-react";
import { letterContent } from "@/actions/file";
import { formValidator } from "@/lib/validator";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MultiPageForm = () => {
  const [parsedPdfText, setParsedPdfText] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [fileId, setFileId] = useState<string | null>("");
  const [letterId, setLetterId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  let finalText = "";

  const form = useForm<z.infer<typeof formValidator>>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      requirements: "",
      pdfFile: "",
      title: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFileUpload = (parsedText: string, fileId: string) => {
    // console.log("File uploaded:", parsedText);
    // console.log("File ID:", fileId);
    setFileId(fileId);
    setParsedPdfText(parsedText);
    form.setValue("pdfFile", parsedText);
  };

  const onSubmit = async (values: z.infer<typeof formValidator>) => {
    // console.log("onSubmit called with values:", values);

    if (!parsedPdfText) {
      toast({
        title: "No file uploaded",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    // console.log("Parsed PDF Text:", parsedPdfText);

    setDialogOpen(true);
    setDialogContent("");

    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          requirements: values.requirements,
          pdfFile: values.pdfFile,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (!response.body) {
        throw new Error("Response has no body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        console.log(chunk);
        finalText += chunk;
        setDialogContent((prevContent) => prevContent + chunk);
      }

      // console.log(finalText);

      // setDialogContent(finalText);
      // const formattedText = formatDialogContent(dialogContent);

      const formattedContent = formatDialogContent(finalText);

      //console.log(finalText); 
      if (!fileId) {
        toast({
          title: "Something went wrong",
          description: "Please try again later @multipageform",
          variant: "destructive",
        });
        return;
      }

      const letter = await letterContent(fileId, formattedContent);

      setLetterId(letter.id);

      form.reset();

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later @multipageform",
        variant: "destructive",
      });
    }
  };

  const formatDialogContent = (text: string) => {
    const paragraphs = text
      .split("\n")
      .filter((paragraph) => paragraph.trim() !== "")
      .map((paragraph) => `<p class="my-2">${paragraph}</p>`);
    return paragraphs.join("");
  };

  const formatTextForDisplay = (text: string) => {
    const paragraphs = text
      .split("\n")
      .filter((paragraph) => paragraph.trim() !== "");
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="my-2">
        {paragraph}
      </p>
    ));
  };




  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(dialogContent)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "The content has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying the content.",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex items-center justify-center h-screen w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="border md:min-w-[900px] border-slate-900 outline outline-1 rounded-lg p-10 max-w-96">
              <div className="h-36 border-white flex flex-col gap-4">
                <h2 className="items-center text-4xl font-bold bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
                  Cover Letter Generator
                </h2>
                <p className="text-md text-wrap">
                  Speed up the job application process with Grammarly’s
                  AI-powered cover letter generator, which helps you create a
                  standout cover letter in three quick steps.
                </p>
              </div>
              <Separator className="mx-0" />

              <div className="flex justify-center items-center gap-7 mt-5">
                <div className="w-1/2 h-max">
                  <FormField
                    control={form.control}
                    name="pdfFile"
                    render={() => (
                      <FormItem>
                        <UploadDropzone onFileUpload={handleFileUpload} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2 flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Job Title</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full mb-5"
                            placeholder="Example: Full Stack Developer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Add job details</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-56"
                            placeholder={`Responsibilities:
- Write clear, concise copy for user interfaces, emails, notifications, and error messages.
- Collaborate with cross-functional partners to ensure UX copy aligns with product vision and user needs.
- Develop and maintain style guides and content standards to ensure consistency and quality.
- Continuously analyze user data and feedback to identify opportunities for improving UX copy.`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full -mt-1 font-bold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-sky-600 hover:to-cyan-500 ease-in-out"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <DialogContent className="min-h-[500px] w-full max-w-72 md:min-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between my-10">
            <p
              className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500
              bg-clip-text text-transparent"
            >
              Generating...
            </p>
            <Copy className="h-6 w-6" onClick={copyToClipboard} />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="mx-5 max-h-[400px] overflow-auto">
          {formatTextForDisplay(dialogContent)}
        </DialogDescription>
        <DialogFooter className="">
          <Link href={`/dashboard/${letterId}`}
            className={buttonVariants({ className: "w-28 flex gap-2 -mt-1 font-bold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-sky-600 hover:to-cyan-500 ease-in-out absolute right-[10px] bottom-[-50px]" })}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MultiPageForm;
