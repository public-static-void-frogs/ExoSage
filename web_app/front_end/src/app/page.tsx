import { CsvDropzone } from "@/components/forms/CsvDropzone";
import { Heading } from "@/components/ui/Heading";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <Heading />
      <CsvDropzone />
    </div>
  );
}
