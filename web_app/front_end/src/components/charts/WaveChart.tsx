import { useChart } from "@/hooks/useChart";
import { AlignedData, Options } from "uplot";
import "uplot/dist/uPlot.min.css";

interface CsvChartProps {
  title: string;
  data: AlignedData;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

export const WaveChart = ({
  data,
  title,
  xLabel,
  yLabel,
  color,
}: CsvChartProps) => {
  const CHART_OPTIONS: Options = {
    title: title || "Wave Chart",
    width: 800,
    height: 400,
    scales: { x: { time: false } },
    series: [
      { label: xLabel ?? "Index" },
      {
        label: yLabel ?? "Wave Data",
        stroke: color ?? "white",
        width: 1,
        value: (u, v) => (v == null || v == 0 ? "0" : v.toExponential(9)),
      },
    ],
    axes: [{ show: false }, { show: false }],
  };

  const chartRef = useChart(data, CHART_OPTIONS);

  return (
    <div className="w-full flex flex-col gap-4">
      <div ref={chartRef} className="w-full" />
    </div>
  );
};
