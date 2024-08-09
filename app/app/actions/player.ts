"use server";

import { getRedisClient } from "@/clients";
import { playerService } from "@/services";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPlayer(_: {message:string} | undefined, data: FormData) {
  const cookieStore = cookies();
  let player = cookieStore.get("player")?.value;

  if (player) redirect("/");

  player = data.get("player") as string | undefined;

  if (!player)
    return {
      message: "Please enter a player name.",
    };

  const client = await getRedisClient();
  try {
    if (await playerService.playerExists(client, player))
      return {
        message: "Player already exists",
      };

    await playerService.createPlayer(client, player);
    cookies().set("player", player);

    revalidatePath("/");
  } finally {
    await client.disconnect();
  }
}
