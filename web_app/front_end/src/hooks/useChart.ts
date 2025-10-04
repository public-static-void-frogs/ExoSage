import { useEffect, useRef } from "react";
import uPlot, { AlignedData, Options } from "uplot";

export const useChart = (data: AlignedData | null, options: Options) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  const destroyPlot = () => {
    if (plotRef.current) {
      plotRef.current.destroy();
      plotRef.current = null;
    }
  };

  useEffect(() => {
    if (!data) {
      destroyPlot();
      return;
    }

    (async () => {
      try {
        if (plotRef.current) {
          plotRef.current.destroy();
        }

        if (chartRef.current) {
          plotRef.current = new uPlot(
            {
              ...options,
              width: chartRef.current?.clientWidth || options.width,
            },
            data,
            chartRef.current
          );
        }
      } catch {
        destroyPlot();
      }
    })();

    return () => {
      destroyPlot();
    };
  }, [data, options]);

  useEffect(() => {
    const handleResize = () => {
      if (plotRef.current && chartRef.current) {
        plotRef.current.setSize({
          width: chartRef.current.clientWidth,
          height: options.height,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [options.height]);

  return chartRef;
};
