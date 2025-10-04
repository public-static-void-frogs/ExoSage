"use client";
import { useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/dropzone";
import { Button } from "../ui/button";

export const CsvDropzone = () => {
  const [files, setFiles] = useState<File[] | undefined>();

  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  return (
    <form className="w-full flex flex-col gap-4 items-center">
      <Dropzone
        accept={{ "image/*": [] }}
        maxFiles={10}
        maxSize={1024 * 1024 * 10}
        minSize={1024}
        onDrop={handleDrop}
        onError={console.error}
        src={files}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      <Button
        className="w-full font-bold h-14 max-w-lg rounded-lg"
        size="lg"
        variant={files ? "default" : "outline"}
      >
        View results
      </Button>
    </form>
  );
};
