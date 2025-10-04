import { Prediction } from "@/types/prediction";
import { AlignedData } from "uplot";
import { WaveChart } from "../charts/WaveChart";

type ResultCardProps = {
  data: AlignedData;
  result: Prediction;
};

export const ResultCard = ({ data, result }: ResultCardProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-gray-200">
      <WaveChart data={data} />
      <div className="flex gap-2">
        <div>Label: {result.label}</div>
        <div>Prediction: {result.prediction}</div>
      </div>
    </div>
  );
};
