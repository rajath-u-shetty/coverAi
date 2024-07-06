"use client";
import { Download, Edit, Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { DeletePayload } from "@/lib/validator";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { CoverLetter } from "@prisma/client";
import { useRef } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const History = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const printRef = useRef(null);

  const { data: coverLetters, isLoading, error } = useQuery({
    queryKey: ["coverLetter"],
    queryFn: async () => {
      const { data } = await axios.get("/api/history");
      return data;
    },
  });

  const { mutate: deleteFile, isLoading: currentlyDeletingFile } = useMutation({
    mutationKey: ["deleteFile"],
    mutationFn: async (id: string) => {
      const payload: DeletePayload = { fileId: id };
      await axios.patch(`/api/history`, payload);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists",
            description: "Please choose another name",
            variant: "destructive",
          });
        } else if (err.response?.status === 422) {
          return toast({
            description: "Please choose a name between 3 and 21 characters",
            variant: "destructive",
          });
        } else if (err.response?.status === 401) {
          router.push("/sign-in");
        }
      }
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries(["coverLetter"]);
    },
  });


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loader" />
    </div>;
  }

  if (error) {
    return (
      <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-8 w-8 text-zinc-800" />
        <h3 className="font-semibold text-xl">Error loading cover letters</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <main className='mx-auto max-w-7xl md:p-10'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent'>
          History
        </h1>
      </div>
      {coverLetters && coverLetters.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {coverLetters
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((letter: CoverLetter) => (
              <li
                key={letter.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link href={`/dashboard/${letter.id}`} className="flex flex-col gap-2">
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {letter.fileName}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-500">
                        {format(new Date(letter.createdAt), "dd MMM yyyy hh:mm a")}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <Link href={`/dashboard/${letter.id}`} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <Link href={`/dashboard/${letter.id}`}
                    className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Link>
                  <Button
                    onClick={() => deleteFile(letter.id)}
                    size="sm"
                    className="w-full"
                    variant="destructive2"
                  >
                    {currentlyDeletingFile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let's upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

