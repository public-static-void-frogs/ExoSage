"use client";

import { ResultCard } from "@/components/ui/ResultCard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDataContext } from "../context/DataContext";

export default function ResultPage() {
  const router = useRouter();
  const { csvData, predictionData } = useDataContext();

  useEffect(() => {
    if (!csvData || !predictionData) {
      router.push("/");
    }
  }, [csvData, predictionData, router]);

  if (!csvData || !predictionData) {
    return null;
  }

  const mergedData = csvData.map((dataRow, index) => ({
    data: dataRow,
    result: predictionData[index] || null,
  }));

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col gap-6 py-2 px-4 max-w-[1152px] w-full">
        <div className="w-full flex flex-col gap-3 mb-5">
          <h1 className="font-bold text-3xl w-full text-center">
            Prediction Results
          </h1>
          <span className="text-white">
            <strong className="text-green-400">PLANET</strong>: This label
            indicates that the detected transit event is highly likely to be
            caused by a real <em>exoplanet</em> orbiting a star. Such events are
            consistent with genuine planetary transits rather than noise or
            other astrophysical effects.
          </span>
          <span className="text-white">
            <strong className="text-gray-400">NOT PLANET</strong>: This label
            indicates that the detected signal is unlikely to represent a true
            exoplanet. It is more consistent with other causes, such as
            instrumental noise, stellar activity, cosmic rays, or processing
            artifacts. <strong>NOT PLANET</strong> may also indicate the absence
            of a true transit event.
          </span>
        </div>
        {mergedData.map((x) => (
          <ResultCard key={x.result.label} data={x.data} result={x.result} />
        ))}
      </div>
    </div>
  );
}
