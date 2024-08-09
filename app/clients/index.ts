import { ClientType, getRedisClient } from "./redisClient";
import ohlcClient, { OHLCClient } from "./ohlcClient";

export { getRedisClient, ohlcClient };

export type { ClientType, OHLCClient as OHLCClient };
