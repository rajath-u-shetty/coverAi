"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "./ui/progress";
import { useToast } from "./ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import axios from "axios";
import { getFile } from "@/actions/file";

const UploadDropzone = ({ onFileUpload }: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const { startUpload } = useUploadThing("pdfUploader");

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        if (acceptedFiles[0].name.split(".").pop() !== "pdf") {
          acceptedFiles.length = 0;
          return toast({
            title: "Invalid file type",
            description: "Please upload a PDF file",
            variant: "destructive",
          });
        }
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        // handle file uploading
        const res = await startUpload(acceptedFiles);

        if (!res) {
          clearInterval(progressInterval);
          setUploadProgress(0);
          setIsUploading(false);
          return toast({
            title: "upload unsuccessful",
            description: "Please try again later @dropzone",
            variant: "destructive",
          });
        }

        console.log(res);

        const [fileResponse] = res;
        const key = fileResponse?.key;
        console.log("fileresponse", fileResponse);

        if (!key) {
          clearInterval(progressInterval);
          setUploadProgress(0);
          setIsUploading(false);
          return toast({
            title: "Something went wrong",
            description: "key not found @dropzone",
            variant: "destructive",
          });
        }

        const file = await getFile(fileResponse.key);

        if (!file.id) {
          return toast({
            title: "file not found",
            description: "file not found @dropzone",
            variant: "destructive",
          });
        }

        console.log("fileId", file.id);
        const fileId = file.id;

        try {
          const formData = new FormData();
          formData.append("file", acceptedFiles[0]);

          const response = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.status === 200) {
            toast({
              title: "Success",
              description: "File uploaded successfully",
              variant: "default",
            });

            // Call onFileUpload with the uploaded file
            clearInterval(progressInterval);
            setUploadProgress(100);
            // console.log(response);

            onFileUpload(response.data, fileId);
          }

          // console.log(response.data);
        } catch (error) {
          console.log(error);

          toast({
            title: "Something went wrong",
            description: "Please try again later @dropzone",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate text-black">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadProgress === 100 ? (
                    <p className="mt-2 text-sm text-center text-green-500">
                      File uploaded
                    </p>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type="file"
                name="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
