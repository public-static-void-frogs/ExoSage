import { Prediction } from "@/types/prediction";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { AlignedData } from "uplot";

type CsvDataType = AlignedData[] | null;
type PredictionDataType = Prediction[] | null;

interface DataContextType {
  csvData: CsvDataType;
  predictionData: PredictionDataType;
  setCsvData: Dispatch<SetStateAction<CsvDataType>>;
  setPredictionData: Dispatch<SetStateAction<PredictionDataType>>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataContextProvider = ({ children }: PropsWithChildren) => {
  const [csvData, setCsvData] = useState<CsvDataType>(null);
  const [predictionData, setPredictionData] =
    useState<PredictionDataType>(null);

  const value = useMemo(() => {
    return { csvData, setCsvData, predictionData, setPredictionData };
  }, [csvData, predictionData]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }

  return context;
};
