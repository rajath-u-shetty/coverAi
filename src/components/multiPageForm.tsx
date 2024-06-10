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
import { formValidator } from "@/lib/formSchema";
import React from "react";
import { useToast } from "./ui/use-toast";

const MultiPageForm = () => {
  const [uploadedfile, setuploadedfile] = React.useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formValidator>>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      requirements: "",
      pdfFile: "",
      title: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFileupload = (file: any) => {
    setuploadedfile(file);
  };

  const onSubmit = async (values: z.infer<typeof formValidator>) => {
    if (!uploadedfile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }

    try {
      const formData = new FormData();
      formData.append("pdfFile", uploadedfile);
      formData.append("title", values.title);
      formData.append("requirements", values.requirements);

      const response = await axios.post("/api/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await axios.post("/api/chatgpt", {
        title: values.title,
        requirements: values.requirements,
        pdfContent: response.data,
      });

      console.log(result.data);
      form.reset();
    } catch (error) { }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border md:min-w-[900px] border-slate-300 dark:border-slate-700 rounded-lg p-12 flex justify-evenly gap-6 w-full">
            <div className="w-1/2">
              <UploadDropzone onFileUpload={handleFileupload} />
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
                className="w-full mt-1"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MultiPageForm;
