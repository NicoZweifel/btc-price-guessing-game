import { ClientType } from "@/clients";

export interface PlayerService {
  createPlayer(client: ClientType, player: string): Promise<string>;
  playerExists(client: ClientType, player: string): Promise<boolean>;
}

export async function createPlayer(
  client: ClientType,
  player: string,
): Promise<string> {
  await client.SADD("players", player);

  return player;
}

export async function playerExists(
  client: ClientType,
  player: string,
): Promise<boolean> {
  const exists = await client.SISMEMBER("players", player);

  return exists;
}

const playerService: PlayerService = { playerExists, createPlayer };

export default playerService;
