"use client";
import { formValidator } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem } from "./ui/form";
import UploadDropzone from "./UploadDropzone";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

const DialogForm = () => {
  const [parsedPdfText, setParsedPdfText] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formValidator>>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      pdfFile: "",
      title: "",
      requirements: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleFileupload = (parsedText: string) => {
    console.log("File uploaded:", parsedText);
    setParsedPdfText(parsedText);
  };

  function onSubmit(values: z.infer<typeof formValidator>) {
    console.log("onSubmit called with values:", values);

    if (parsedPdfText == null) {
      return toast({
        title: "parsedPdf null",
        description: "parsedPdf text is null",
        variant: "destructive",
      });
    }

    const formdata = new FormData();
    formdata.append("pdfFile", parsedPdfText);
    formdata.append("title", values.title);
    formdata.append("requirements", values.requirements);
    formdata.forEach((value, key) => {
      console.log(key, value);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="pdfFile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <UploadDropzone onFileUpload={handleFileupload} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Requirements" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default DialogForm;
