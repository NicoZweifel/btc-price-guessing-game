import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  Chart,
  CreatePredictionForm,
  EvaluatePredictionForm,
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
          {prediction ? (
            <EvaluatePredictionForm prediction={prediction} />
          ) : (
            <CreatePredictionForm />
          )}
          <div className="pt-2">
            <p className="text-neutral-200">Highscore</p>
            <p className="text-2xl text-neutral-200 text-center">
              {highscore ?? 0}
            </p>
          </div>
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
