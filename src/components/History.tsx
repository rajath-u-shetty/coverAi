"use client";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DeletePayload } from "@/lib/validator";

export const History = () => {
  const { data: coverLetter, isLoading } = useQuery({
    queryKey: ["coverLetter"],
    queryFn: async () => {
      const { data } = await axios.get("/api/history");
      return data;
    },
  });

  const { mutate: deleteFile, isLoading: currentlyDeletingFile } = useMutation({
    mutationKey: ["deleteFile"],
    mutationFn: async (id: string) => {
      const payload: DeletePayload = {
        fileId: id,
      };

      await axios.patch(`/api/history`, payload);
    },
    onError: (error) => {
      console.error("Error deleting file:", error);
      // Optionally, add your toast notification here
    },
    onSuccess: () => {
      // Optionally, add your success toast notification here
    },
  });

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">History</h1>
      </div>

      {coverLetter && coverLetter?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {coverLetter
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((letter: any) => (
              <li
                key={letter.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${letter.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {letter.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(letter.createdAt), "MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>

                  <Button
                    onClick={() => deleteFile(letter.id)}
                    size="sm"
                    className="w-full"
                    variant="destructive"
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
      ) : isLoading ? (
        // <Skeleton height={100} className="my-2" count={3} />
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let's upload your first PDF.</p>
        </div>
      )}
    </div>
  );
};
