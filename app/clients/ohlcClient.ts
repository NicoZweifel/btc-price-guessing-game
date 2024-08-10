import { OHLCData } from "@/types";

export interface OHLCClient {
  get(timestamp: number): Promise<OHLCData[]>;
}

async function get(timestamp: number) {
  let data = await fetch(
    `https://www.bitstamp.net/api/v2/ohlc/btcusd/?limit=60&step=60&start=${timestamp}`,
  ).then((x) => x.json());
  data = data.data.ohlc;
  return data;
}

const ohlcClient: OHLCClient = { get };

export default ohlcClient;
