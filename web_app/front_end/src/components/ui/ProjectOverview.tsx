"use client";
import Image from "next/image";
import { Button } from "./button";
import { ArrowUp, Download } from "lucide-react";

export const ProjectOverview = () => {
  return (
    <div className="flex flex-col max-w-[1152px]">
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  );
};

export const Section1 = () => {
  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center">
      <h2 className="font-bold h-16 text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        n*sa pipeline problem
      </h2>

      <Image
        src="/image-1.png"
        alt="NASA Pipeline"
        width={1200}
        height={400}
        className="w-full h-auto"
      />

      <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
        There are a few big issues with the current NASA pipeline. First, it’s
        built from a bunch of interconnected modules, each written in a
        different language — mainly Java, MATLAB, and C — and all run
        separately. The Java code handles automation and data management, while
        the scientific and numerical parts are written mostly in MATLAB, with
        some low-level routines in C. NASA’s own team even mentions that it’s
        not expected that anyone outside their environment can build or run it,
        because of licensing restrictions, dependencies, and other
        complications. That makes it difficult to maintain, even for experienced
        users, and nearly impossible for new researchers trying to get started.
        Second, it’s very slow. Based on NASA’s public reports, the full Kepler
        dataset takes around 45–60 days to process end-to-end. That’s an
        estimate we made quickly from their GitHub documentation and may not be
        completely accurate, but it gives a reasonable sense of scale. Third, it
        depends heavily on proprietary tools like MATLAB. While that’s fine for
        internal use, it limits reproducibility, automation, and the ability to
        run the pipeline easily in open or distributed environments.
      </p>
    </div>
  );
};

export const Section2 = () => {
  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center">
      <h2 className="font-bold h-16 text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        our solution
      </h2>

      <Image
        src="/image-2.png"
        alt="NASA Pipeline"
        width={1200}
        height={400}
        className="w-full h-auto"
      />

      <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
        Our system automates several of the later stages of the pipeline —
        mainly the Transit Planet Search (TPS) outputs, the full Data Validation
        (DV) diagnostics suite, the generation of vetting forms, and the
        Robovetter classification. This cuts the total runtime dramatically. The
        original setup takes about 10 days in wall-clock time for the DV stage
        alone, and about 15 days for the whole thing. Our model processes [N]{" "}
        light curves in [TIME], which, if scaled up, would take about [TIME2]{" "}
        for the full set of 35,000 light curves that normally enter the TPS
        module. These numbers are approximate but show a clear reduction in
        computational time. Our pipeline also removes the friction of gluing
        together different components. Everything runs in a single, consistent
        environment without the Java–MATLAB–C dependency chain, making it faster
        to deploy, easier to maintain, and more accessible for new scientists
        joining the project.
      </p>
    </div>
  );
};

export const Section3 = () => {
  const scrollToSubmit = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen items-center justify-center">
      <h2 className="font-bold h-16 text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        try it yourself
      </h2>
      <div className="w-full flex flex-row gap-4">
        <CsvLinkCard
          title="small dataset"
          description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur deleniti excepturi pariatur rerum alias, at enim doloremque maxime id non"
          link=""
        />
        <CsvLinkCard
          title="medium dataset"
          description="deleniti excepturi pariatur rerum alias, at enim doloremque maxime id non deleniti excepturi pariatur rerum alias, at enim doloremque maxime id non "
          link=""
        />
        <CsvLinkCard
          title="large dataset"
          description=" culpa molestias porro magnam nemo deserunt dolor eveniet ipsam et. deleniti excepturi pariatur rerum alias, at enim doloremque maxime id non"
          link=""
        />
      </div>
      <Button
        size="lg"
        className="mt-4 w-full max-w-sm font-bold h-14 rounded-lg text-lg cursor-pointer"
        onClick={() => scrollToSubmit()}
      >
        Try it out <ArrowUp className="size-5" />
      </Button>
    </div>
  );
};

const CsvLinkCard = ({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <div className="flex flex-col w-full border border-neutral-50 rounded-lg p-6 gap-4 min-h-72">
      <p className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        {title}
      </p>
      <p>{description}</p>
      <Button asChild>
        <a className="flex flex-row gap-2 items-center mt-auto" href={link}>
          Download CSV sample <Download />
        </a>
      </Button>
    </div>
  );
};
