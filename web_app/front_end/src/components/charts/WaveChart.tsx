import { useChart } from "@/hooks/useChart";
import { AlignedData, Options } from "uplot";
import "uplot/dist/uPlot.min.css";

interface CsvChartProps {
  data: AlignedData;
}

const CHART_OPTIONS: Options = {
  title: "CSV Data Chart",
  width: 800,
  height: 400,
  scales: { x: { time: false } },
  series: [
    { label: "Index" },
    {
      label: "Wave Data",
      stroke: "white",
      width: 1,
    },
  ],
};

export const WaveChart = ({ data }: CsvChartProps) => {
  const chartRef = useChart(data, CHART_OPTIONS);

  return (
    <div className="w-full flex flex-col gap-4">
      <div ref={chartRef} className="w-full" />
    </div>
  );
};
