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
    <div className="flex flex-col gap-4">
      {mergedData.map((x) => (
        <ResultCard key={x.result.label} data={x.data} result={x.result} />
      ))}
    </div>
  );
}
