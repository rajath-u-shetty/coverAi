"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/formSchema";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import UplaodButton from "./UplaodButton";

const MultiPageForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      details: "",
      pdfFile: "",
      title: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="flex justify-center items-center h-full">
      <Form {...form}>
        <form className="border border-black p-5">
          <FormField
            name="pdfFile"
            render={({ field }) => (
              <FormItem className="">
                <FormControl className="">
                  <UplaodButton />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default MultiPageForm;
