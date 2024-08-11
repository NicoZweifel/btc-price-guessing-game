import { highscoreService, predictionService } from "@/services";
import { OrderData, Prediction } from "@/types";
import { getRedisClient, orderClient } from "@/clients";

export type HomeServiceResult = {
  prediction?: Prediction;
  highscore: number | null;
  leaderboard: string[];
  orders: OrderData[];
};

export interface HomeService {
  getData(player: string): Promise<HomeServiceResult>;
}

async function getData(player: string): Promise<HomeServiceResult> {
  const client = await getRedisClient();
  let res: [Prediction | undefined, number | null, string[], OrderData[]];

  try {
    res = await Promise.all([
      predictionService.getPrediction(client, player),
      highscoreService.getHighscore(client, player),
      highscoreService.getRange(client, 0, 50),
      orderClient.get(),
    ]);
  } finally {
    await client.disconnect();
  }

  const [prediction, highscore, leaderboard, orders] = res;
  return { prediction, highscore, leaderboard, orders };
}

const homeService: HomeService = { getData };

export default homeService;
