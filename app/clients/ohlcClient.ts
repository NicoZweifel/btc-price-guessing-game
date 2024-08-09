import { OHLCData } from "@/types";

export interface OHLCClient {
  getData(timestamp: number): Promise<OHLCData[]>;
}

async function getData(timestamp: number) {
  let data = await fetch(
    `https://www.bitstamp.net/api/v2/ohlc/btcusd/?limit=60&step=60&start=${timestamp}`,
  ).then((x) => x.json());
  data = data.data.ohlc;
  return data;
}

const ohlcClient: OHLCClient = { getData };

export default ohlcClient;
