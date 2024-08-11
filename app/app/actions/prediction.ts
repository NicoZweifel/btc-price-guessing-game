"use server";

import { DIRECTION, EvaluatePredictionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { predictionService, highscoreService } from "@/services";
import { getRedisClient, ohlcClient } from "@/clients";
import { compareOHLC } from "@/utils";

export async function createPrediction(formData: FormData) {
  const cookieStore = cookies();
  let player = cookieStore.get("player")?.value;

  if (!player) redirect("/player/create");

  const direction = formData.get("direction") as DIRECTION | null;

  if (!direction) return { message: "Direction is missing!" };

  const client = await getRedisClient();
  try {
    await predictionService.createPrediction(client, {
      player,
      timestamp: Math.trunc(Date.now() / 1000),
      direction,
    });

    revalidatePath("/");
  } finally {
    await client.disconnect();
  }
}

export async function evaluatePrediction(): Promise<
  EvaluatePredictionResult | undefined
> {
  const cookieStore = cookies();
  const player = cookieStore.get("player");

  if (!player) redirect("/player/create");

  const client = await getRedisClient();

  try {
    const prediction = await predictionService.getPrediction(
      client,
      player.value,
    );

    if (!prediction) {
      revalidatePath("/");
      return;
    }

    const predicted = await predictionService.evaluatePrediction(
      prediction,
      ohlcClient,
      compareOHLC,
    );

    if (!predicted?.resolved) return predicted;

    await highscoreService.updateHighscore(
      client,
      player.value,
      predicted.value,
    );

    revalidatePath("/");
  } finally {
    await client.disconnect();
  }
}
