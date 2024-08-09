import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { predictionService, highscoreService } from "@/services";
import PredictionView from "./PredictionView";
import { getRedisClient } from "@/clients";

export default async function Home() {
  const cookieStore = cookies();
  const player = cookieStore.get("player");

  if (!player) redirect("/player/create");

  const client = await getRedisClient();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PredictionView
        predictionService={predictionService}
        highscoreService={highscoreService}
        player={player.value}
        client={client}
      />
    </main>
  );
}
