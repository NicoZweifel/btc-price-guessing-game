import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  Chart,
  CreatePredictionForm,
  EvaluatePredictionForm,
  PredictionLabel,
  Price,
} from "@/components";
import { highscoreService, predictionService } from "@/services";
import { Prediction } from "@/types";
import { getRedisClient } from "@/clients";

export default async function Home() {
  const cookieStore = cookies();
  const player = cookieStore.get("player");

  if (!player) redirect("/player/create");

  const client = await getRedisClient();

  let res: [Prediction | undefined, number | null, string[]];

  try {
    res = await Promise.all([
      predictionService.getPrediction(client, player.value),
      highscoreService.getHighscore(client, player.value),
      highscoreService.getRange(client, 0, 10),
    ]);
  } finally {
    await client.disconnect();
  }

  const [prediction, highscore, leaderBoard] = res;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex grow w-full flex-row gap-4 justify-center">
        <div className="flex grow flex-col gap-2 max-w-5xl items-center justify-between font-mono text-sm">
          <Chart className="flex flex-col grow" />
          <Price className="pt-2" />
          <EvaluatePredictionForm prediction={prediction} />
          {prediction ? (
            <PredictionLabel prediction={prediction} />
          ) : (
            <CreatePredictionForm />
          )}
          {highscore && (
            <div>
              <p className="text-neutral-200 pt-4">Highscore</p>
              <p className="text-2xl text-neutral-200 text-center">
                {highscore}
              </p>
            </div>
          )}
        </div>
        <div>
          <p className="text-neutral-200">Leaderboard</p>
          {leaderBoard.map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
