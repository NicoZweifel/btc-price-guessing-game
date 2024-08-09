import { ClientType } from "@/clients";

export interface HighscoreService {
  getHighscore(client: ClientType, player: string): Promise<number | null>;
  getRank(client: ClientType, player: string): Promise<number | null>;
  updateHighscore(
    client: ClientType,
    player: string,
    predicted: boolean,
  ): Promise<number>;
  getRange(client: ClientType, start: number, stop: number): Promise<string[]>;
}

function getHighscore(client: ClientType, player: string) {
  return client.ZSCORE("highscore", player);
}

function getRank(client: ClientType, player: string) {
  return client.ZREVRANK("highscore", player);
}

function getRange(
  client: ClientType,
  start: number,
  stop: number,
): Promise<string[]> {
  return client.ZRANGE("highscore", start, stop);
}

async function updateHighscore(
  client: ClientType,
  player: string,
  predicted: boolean,
): Promise<number> {
  const current = await getHighscore(client, player);
  const currentScore = current ?? 0;

  if (predicted === undefined) return 0;

  const value = await client
    .multi()
    .ZADD("highscore", {
      score: predicted ? currentScore + 1 : currentScore,
      value: player,
    })
    .HDEL(`predictions:${player}`, "direction")
    .HDEL(`predictions:${player}`, "timestamp")
    .exec();

  return value[0] as number;
}

const highscoreService: HighscoreService = {
  getHighscore,
  updateHighscore,
  getRank,
  getRange,
};

export default highscoreService;
