"use client";
import { ArrowUp, Download } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

export const ProjectOverview = () => {
  return (
    <div className="flex flex-col max-w-[1152px] w-full">
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </div>
  );
};

const Section1 = () => {
  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center w-full">
      <h2 className="font-bold text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        Transit event
      </h2>

      <Image
        src="/transitive_event.png"
        alt="NASA Pipeline"
        width={1200}
        height={400}
        className="w-full max-w-3xl h-auto"
      />

      <div className="flex flex-col gap-2">
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          Distant stars are observed continuously. If a planet in orbit around
          that star happens to cross the line between the star and the observer,
          it blocks a small fraction of the starlight for a short period. This
          way a tiny, periodic decrease in the star’s brightness is produced.
          Such an event is called transit.
        </p>
      </div>
    </div>
  );
};

const Section2 = () => {
  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center w-full">
      <h2 className="font-bold text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        Nasa pipeline problem
      </h2>

      <Image
        src="/image-1.png"
        alt="NASA Pipeline"
        width={1200}
        height={400}
        className="w-full h-auto"
      />

      <div className="flex flex-col gap-2">
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          The current NASA pipeline has a couple of drawbacks:
        </p>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          - <strong>It is difficult to maintain</strong>. It consists of a bunch
          of interconnected modules, each written in a different language —
          mainly Java, MATLAB, and C — and each runs separately. The Java code
          handles automation and data management, while the scientific and
          numerical parts are written mostly in MATLAB, with some low-level
          routines in C. According to NASA’s own team, it’s not expected that
          anyone outside their environment can build or run it due to licensing
          restrictions, dependencies, and other complications.
        </p>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          - <strong>It is very slow</strong>. Based on NASA’s public reports,
          the full Kepler dataset takes around 45–60 days to process end-to-end.
          That’s an estimate we made quickly from their GitHub documentation and
          may not be completely accurate, but it gives a reasonable sense of
          scale.
        </p>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          - <strong>It is heavily dependent</strong> on proprietary tools like
          MATLAB. It works fine for internal use, however, it limits
          reproducibility, automation, and the ability to run the pipeline
          easily in open or distributed environments.
        </p>
      </div>
    </div>
  );
};

const Section3 = () => {
  return (
    <div className="flex flex-col gap-6 min-h-screen items-center justify-center w-full">
      <h2 className="font-bold text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        Our solution
      </h2>

      <Image
        src="/image-2.png"
        alt="NASA Pipeline"
        width={1200}
        height={400}
        className="w-full h-auto"
      />

      <div className="flex flex-col gap-2">
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          Our system automates several of the later stages of the pipeline —
          mainly the Transit Planet Search (TPS) outputs, the full Data
          Validation (DV) diagnostics suite, the generation of vetting forms,
          and the Robovetter classification. This way, the total runtime is cut
          dramatically.
        </p>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          The original setup takes about 10 days in wall-clock time for the DV
          stage alone, and about 15 days for the whole thing. Our model
          processes [N] light curves in [TIME], which, if scaled up, would take
          about [TIME2] for the full set of 35,000 light curves that normally
          enter the TPS module. These numbers are approximate but show a clear
          reduction in computational time.
        </p>
        <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
          Also, our pipeline removes the friction of gluing together different
          components. Everything runs in a single, consistent environment
          without the Java–MATLAB–C dependency chain, making it faster to
          deploy, easier to maintain, and more accessible for new scientists
          joining the project.
        </p>
      </div>
    </div>
  );
};

const Section4 = () => {
  const scrollToSubmit = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-10 min-h-screen items-center justify-center w-full">
      <h2 className="font-bold h-16 text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase">
        try it yourself
      </h2>
      <div className="w-full flex flex-row gap-4 md:flex-nowrap flex-wrap">
        <CsvLinkCard
          title="Sample With IDs"
          description="This dataset contains 10 examples of light curves with identifiers. The light curves represent both planet and not planet cases."
          link="/sample_with_ids.csv"
        />
        <CsvLinkCard
          title="Sample Without IDs"
          description="This dataset contains 10 examples of light curves without identifiers. The light curves represent both planet and not planet cases."
          link="/sample_without_ids.csv"
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
        <a
          className="flex flex-row gap-2 items-center mt-auto"
          href={link}
          download
        >
          Download CSV sample <Download />
        </a>
      </Button>
    </div>
  );
};
