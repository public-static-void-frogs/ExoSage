"use client";
import { useDataContext } from "@/app/context/DataContext";
import { parseCsv } from "@/app/utils/parse-csv";
import { sendCsvData } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/dropzone";

export const CsvDropzone = () => {
  const [file, setFile] = useState<File | undefined>();
  const router = useRouter();
  const { setCsvData, setPredictionData } = useDataContext();

  const mutation = useMutation({
    mutationFn: (csvFile: File) => sendCsvData(csvFile),
    onSuccess: (response) => {
      console.log("Success:", response);
      setPredictionData(response.data);
      router.push("/result");
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleDrop = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      const parsedData = await parseCsv(files[0]);
      setCsvData(parsedData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      mutation.mutate(file);
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-4 items-center max-w-3xl"
      onSubmit={handleSubmit}
    >
      <Dropzone
        accept={{ "text/csv": [".csv"] }}
        maxFiles={1}
        maxSize={1024 * 1024 * 100}
        minSize={0}
        onDrop={handleDrop}
        onError={console.error}
        src={file ? [file] : undefined}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      <Button
        className="w-full font-bold h-14 rounded-lg"
        size="lg"
        variant={file ? "default" : "outline"}
        type="submit"
        disabled={!file || mutation.isPending}
      >
        {mutation.isPending ? "Processing..." : "View results"}
      </Button>

      {mutation.isError && (
        <p className="text-red-500 text-sm">
          An unexpected error occurred. Please try again later.
        </p>
      )}
    </form>
  );
};
