import { CsvDropzone } from "@/components/forms/CsvDropzone";
import { Background } from "@/components/layout/Background";
import { Heading } from "@/components/ui/Heading";
import { ProjectOverview } from "@/components/ui/ProjectOverview";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-6 items-center justify-center min-h-screen mb-10">
        <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full">
          <Heading />
          <CsvDropzone />
        </div>
        <ProjectOverview />
      </div>
      <Background />
    </>
  );
}
