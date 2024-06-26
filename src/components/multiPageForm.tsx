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
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { formValidator } from "@/lib/formSchema";
import IconAnimation from "./IconAnimation";
import { Separator } from "./ui/separator";
import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

const MultiPageForm = () => {
  const [parsedPdfText, setParsedPdfText] = useState<string | null>(null);
  const [formNotSubmitted, setFormNotSubmitted] = useState(true);
  const { toast } = useToast();

  const [value, setValue] = useState("");
  // const quillRef = useRef<ReactQuill | null>(null);

  const form = useForm<z.infer<typeof formValidator>>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      requirements: "",
      pdfFile: "",
      title: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFileUpload = (parsedText: string) => {
    console.log("File uploaded:", parsedText);
    setParsedPdfText(parsedText);
    form.setValue("pdfFile", parsedText); // Set the pdfFile field with parsed text
  };

  const onSubmit = async (values: z.infer<typeof formValidator>) => {
    console.log("onSubmit called with values:", values);

    if (!parsedPdfText) {
      toast({
        title: "No file uploaded",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    console.log("Parsed PDF Text:", parsedPdfText);

    setFormNotSubmitted(false);
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
      let finalText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        console.log(chunk); // Process each chunk as it arrives
        finalText += chunk;

        // Update ReactQuill editor content
        // quillRef.current?.getEditor().clipboard.dangerouslyPasteHTML(finalText);
      }

      console.log("Final text:", finalText);

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

  return (
    <Dialog>
      {" "}
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
                  <DialogTrigger asChild>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full -mt-1 font-bold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-sky-600 hover:to-cyan-500 ease-in-out"
                    >
                      Submit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    a
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this file from our servers?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="submit">Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Dialog>
  );
};

export default MultiPageForm;
