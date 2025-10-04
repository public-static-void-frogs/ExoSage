import { CsvDropzone } from "@/components/forms/CsvDropzone";
import { Heading } from "@/components/ui/Heading";
import { ProjectOverview } from "@/components/ui/ProjectOverview";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <Spotlight />
      <div className="flex flex-col gap-6 items-center justify-center min-h-screen w-full">
        <Heading />
        <CsvDropzone />
      </div>
      <ProjectOverview />
    </div>
  );
}
