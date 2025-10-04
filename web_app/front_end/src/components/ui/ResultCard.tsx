import { getChartBorderColor, getChartColor } from "@/app/utils/chart-color";
import { cn } from "@/lib/utils";
import { Prediction } from "@/types/prediction";
import { AlignedData } from "uplot";
import { WaveChart } from "../charts/WaveChart";

type ResultCardProps = {
  data: AlignedData;
  result: Prediction;
};

export const ResultCard = ({ data, result }: ResultCardProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 w-full p-4 rounded-lg border bg-background/90",
        getChartBorderColor(result.prediction)
      )}
    >
      <WaveChart
        data={data}
        title={`${result.label} - ${result.prediction}`}
        color={getChartColor(result.prediction)}
      />
    </div>
  );
};
