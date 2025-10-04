import { Prediction } from "@/types/prediction";

export const getChartBorderColor = (prediction: Prediction["prediction"]) => {
  switch (prediction) {
    case "PLANET":
    case "CONFIRMED":
      return "border-green-500/50 bg-green-500/10";
    case "CANDIDATE":
      return "border-yellow-500/50 bg-yellow-500/10";
    case "NO PLANET":
    case "FALSE POSITIVE":
      return "border-gray-500/50 bg-gray-500/10";
    case "TRUE NEGATIVE":
      return "border-red-500/50 bg-red-500/10";
    default:
      return "white";
  }
};

export const getChartColor = (prediction: Prediction["prediction"]) => {
  switch (prediction) {
    case "PLANET":
    case "CONFIRMED":
      return "#7FD18C";
    case "CANDIDATE":
      return "#E7D87B";
    case "NO PLANET":
    case "FALSE POSITIVE":
      return "#B0B0B0";
    case "TRUE NEGATIVE":
      return "#E47C7C";
    default:
      return "#D9D9D9";
  }
};
