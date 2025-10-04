export type Prediction = {
  label: string;
  prediction:
    | "CONFIRMED"
    | "CANDIDATE"
    | "FALSE POSITIVE"
    | "TRUE NEGATIVE"
    | "PLANET"
    | "NO PLANET";
};
