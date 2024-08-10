import { ClientType, OHLCClient } from "@/clients";
import {
  Prediction,
  DIRECTION,
  OHLCData,
  EvaluatePredictionResult,
} from "@/types";

export interface PredictionService {
  getPrediction(
    client: ClientType,
    player: string,
  ): Promise<Prediction | undefined>;
  createPrediction(
    client: ClientType,
    prediction: Prediction,
  ): Promise<Prediction>;
  evaluatePrediction(
    prediction: Prediction,
    ohlcClient: OHLCClient,
    comparer: (first: OHLCData, second: OHLCData) => DIRECTION,
  ): Promise<EvaluatePredictionResult | undefined>;
}

async function getPrediction(
  client: ClientType,
  player: string,
): Promise<Prediction | undefined> {
  const prediction = await client.HGETALL(`predictions:${player}`);

  if (!prediction.timestamp || !prediction.direction) return undefined;
  return {
    player,
    timestamp: parseInt(prediction.timestamp),
    direction: parseInt(prediction.direction),
  };
}

async function createPrediction(
  client: ClientType,
  { player, timestamp, direction }: Prediction,
): Promise<Prediction> {
  await client
    .multi()
    .HSET(`predictions:${player}`, "timestamp", timestamp)
    .HSET(`predictions:${player}`, "direction", direction)
    .exec();

  return { player, timestamp, direction };
}

async function evaluatePrediction(
  prediction: Prediction,
  ohlcClient: OHLCClient,
  comparer: (firstCandle: OHLCData, secondCandle: OHLCData) => DIRECTION,
): Promise<EvaluatePredictionResult | undefined> {
  const data = await ohlcClient.getData(prediction.timestamp);

  if (data.length < 2) {
    return undefined; // Insufficient data
  }

  const [first] = data;

  let movement = DIRECTION.UNCHANGED;

  const predictionResolvable =
    Math.trunc(Date.now() / 1000) - prediction.timestamp >= 60;

  for (const second of data.slice(1)) {
    const candleClosed =
      data.length > 2 && Math.trunc(Date.now() / 1000) - second.timestamp >= 60;

    movement = comparer(first, second);

    if (!candleClosed || !predictionResolvable) {
      return {
        value: movement === prediction.direction,
        closed: false,
      };
    }

    if (movement !== DIRECTION.UNCHANGED) break;
  }

  if (movement == DIRECTION.UNCHANGED) {
    return { closed: false };
  }

  return { closed: true, value: movement === prediction.direction };
}

const service: PredictionService = {
  createPrediction,
  getPrediction,
  evaluatePrediction,
};

export default service;
