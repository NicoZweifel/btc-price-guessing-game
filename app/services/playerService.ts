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

export function playerExists(
  client: ClientType,
  player: string,
): Promise<boolean> {
  return client.SISMEMBER("players", player);
}

const playerService: PlayerService = { playerExists, createPlayer };

export default playerService;
