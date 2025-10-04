export type Prediction = {
  label: string;
  prediction:
    | "CONFIRMED"
    | "CANDIDATE"
    | "FALSE POSITIVE"
    | "TRUE NEGATIVE"
    | "PLANET"
    | "NOT PLANET";
};
