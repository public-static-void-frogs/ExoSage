import Image from "next/image";

export const Heading = () => {
  return (
    <div className="w-full rounded-md flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <div className="flex gap-6 justify-around w-full items-center flex-wrap-reverse md:flex-nowrap">
          <div className="max-w-3xl flex flex-col gap-4 text-center md:text-left">
            <h1 className="flex gap-2 items-center justify-center font-bold text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              <span className="mb-1">ExoSage</span>
              <Image
                src="/icon.png"
                alt="Website icon"
                height={100}
                width={100}
                className="size-14"
              />
            </h1>
            <h2 className="text-neutral-300 text-base md:text-lg leading-relaxed">
              ExoSage is a platform powered by cutting-edge machine learning
              technologies designed to make exoplanet discovery accessible and
              precise. By simply uploading a dataset of light curves, both
              novices and seasoned researchers can quickly receive accurate
              predictions on whether a detected transit event is a potential
              exoplanet or a likely false positive.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};
