import { Prediction } from "@/types/prediction";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type DataResponse = { data: Prediction[] };

export const sendCsvData = async (csvFile: File): Promise<DataResponse> => {
  const formData = new FormData();
  formData.append("input_dataset", csvFile);

  const response = await apiClient.post<DataResponse>("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
