"use client";

import { ResultCard } from "@/components/ui/ResultCard";
import { useDataContext } from "../context/DataContext";

export default function ResultPage() {
  const { csvData, predictionData } = useDataContext();

  if (!csvData || !predictionData) {
    return <div>No data available. Please upload a CSV file first.</div>;
  }

  const mergedData = csvData.map((dataRow, index) => ({
    data: dataRow,
    result: predictionData[index] || null,
  }));

  return (
    <div className="flex flex-col gap-6 py-2 px-4">
      <div className="w-full flex flex-col gap-3 mb-5">
        <h1 className="font-bold text-3xl w-full text-center">
          Prediction Results
        </h1>
        <span className="text-white">
          <strong className="text-green-500">PLANET</strong>: This label
          indicates that the candidate object is classified as an{" "}
          <em>exoplanet</em>. Exoplanets are planets that orbit stars outside
          our Solar System. They are identified through detection methods such
          as the transit method (a dip in starlight when a planet passes in
          front of its star) or radial velocity (the star’s wobble due to
          gravitational pull). If the response is <strong>PLANET</strong>, it
          means the observed signal is consistent with a genuine planetary body.
        </span>
        <span className="text-white">
          <strong className="text-gray-500">NOT PLANET</strong>: This label
          means that the candidate signal does not correspond to a true
          exoplanet. Instead, it may be explained by other astrophysical
          phenomena, such as binary stars, background eclipsing systems, stellar
          variability, or even instrumental noise. If the response is{" "}
          <strong>NOT PLANET</strong>, the data suggests the signal cannot be
          reliably attributed to a planetary body.
        </span>
      </div>
      {mergedData.map((x) => (
        <ResultCard key={x.result.label} data={x.data} result={x.result} />
      ))}
    </div>
  );
}
