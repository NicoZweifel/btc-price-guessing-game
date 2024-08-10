import { ClientType, getRedisClient } from "./redisClient";
import ohlcClient, { OHLCClient } from "./ohlcClient";
import orderClient, { OrderClient } from "./orderClient";

export { getRedisClient, ohlcClient, orderClient };

export type { ClientType, OHLCClient as OHLCClient, OrderClient };
