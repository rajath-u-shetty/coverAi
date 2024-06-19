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
import axios from "axios";
import UploadDropzone from "./UploadDropzone";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import React from "react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    title: z
      .string()
      .min(5, { message: "Title must be at least 5 characters" }),
    requirements: z
      .string()
      .min(10, { message: "Requirements must be at least 10 characters" }),
    pdfFile: z.string().nonempty({ message: "PDF file is required" }),
  })
  .required();

const MultiPageForm = () => {
  const [parsedPdfText, setParsedPdfText] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
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

  const onSubmit = async (values: z.infer<typeof schema>) => {
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

    try {
      const response = await axios.post("/api/chatgpt", {
        pdfFile: values.pdfFile,
        title: values.title,
        requirements: values.requirements,
      });

      console.log("Response:", response);

      if (response.status !== 200) {
        return toast({
          title: "Something went wrong",
          description: "Please try again later @multipageform",
          variant: "destructive",
        });
      }

      if (!response.data) {
        return toast({
          title: "No response from chatgpt",
          description: "Please try again later @multipageform",
          variant: "destructive",
        });
      }

      console.log("Response data:", response.data);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      return toast({
        title: "Something went wrong",
        description: "Please try again later @multipageform",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border md:min-w-[900px] border-slate-300 dark:border-slate-700 rounded-lg p-12 flex justify-evenly gap-6 w-full">
          <div className="w-1/2">
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
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Job Title</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="Example: Full Stack Developer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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

            <Button type="submit" disabled={isLoading} className="w-full mt-1">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MultiPageForm;
