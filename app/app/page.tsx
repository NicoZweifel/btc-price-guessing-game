import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  Chart,
  CreatePredictionForm,
  EvaluatePredictionForm,
  Price,
} from "@/components";
import { homeService } from "@/services";

export default async function Home() {
  const cookieStore = cookies();
  const player = cookieStore.get("player");

  if (!player) redirect("/player/create");

  const { prediction, highscore, leaderboard, orders } =
    await homeService.getData(player.value);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex grow w-full flex-col lg:flex-row gap-4 justify-center">
        <div className="flex grow flex-col gap-2 max-w-5xl items-center justify-between font-mono text-sm">
          <Chart className="flex flex-col grow" />
          <Price
            initialPrice={orders.length > 0 ? orders[0].price : 0}
            className="pt-2"
          />
          {prediction ? (
            <EvaluatePredictionForm prediction={prediction} />
          ) : (
            <CreatePredictionForm />
          )}
          <div className="pt-2">
            <p className="text-lg font-semibold">
              {player.value}
              {"'"}s highscore
            </p>
            <p className="text-2xl text-center">{highscore ?? 0}</p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold">Leaderboard</p>
          {leaderboard.reverse().map((x) => (
            <p key={x}>{x}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
