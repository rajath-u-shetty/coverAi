"use client"

import "@uploadthing/react/styles.css"
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { UploadDropzone } from "@/utils/uploadthing";

interface FileUploadProps {
    onChange: (url?: string ) => void;
    value: string;
    endpoint: `/api/generate`
    onUploadSuccess: (url: string) => void
}

const FileUpload = ({
    endpoint,
    onChange,
    value,
    onUploadSuccess
}: FileUploadProps) => {

    const fileType = value?.split(".").pop();

    if(value && fileType !== 'pdf'){
        return (
            <div className="relative h-20 w-20">
                <Image fill src={value} alt="uplaod" className="rounded-full" />
                <Button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm" type="button">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )
    }
  return (
    // <UploadDropzone 
    //      endpoint={endpoint}
    //     onClientUploadComplete={(res) => {
    //         onChange(res?.[0].url)
    //     }}
    //     onUploadError={(error: Error) => {
    //         console.log(error);
            
    //     }}
    // />
    <div></div>
  )
}

export default FileUpload