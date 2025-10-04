export const Heading = () => {
  return (
    <div className="flex gap-6 justify-around w-full items-center flex-wrap-reverse md:flex-nowrap">
      <div className="max-w-xl flex flex-col gap-4">
        <h1 className="font-bold text-4xl">ExoSage</h1>
        <h2 className="text-muted-foreground">
          ExoSage is a platform powered by cutting-edge machine learning
          technologies designed to make exoplanet discovery accessible and
          precise. By simply uploading a dataset of light curves, both novices
          and seasoned researchers can quickly receive accurate predictions on
          whether a detected transit event is a potential exoplanet or a likely
          false positive.
        </h2>
      </div>
    </div>
  );
};
