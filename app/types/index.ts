export type Prediction = {
  player: string;
  timestamp: number;
  direction: DIRECTION;
};

export type EvaluatePredictionResult =
  | {
      value?: boolean;
      resolved: false;
    }
  | {
      value: boolean;
      resolved: true;
    };

export enum DIRECTION {
  UNCHANGED = 0,
  UP = 1,
  DOWN = 2,
}

export type OHLCData = {
  timestamp: number;
  open: number;
  low: number;
  close: number;
  high: number;
  volume: number;
};

export type OHLCComparer = (first: OHLCData, second: OHLCData) => DIRECTION;
