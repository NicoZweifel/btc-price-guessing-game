import { OrderData } from "@/types";

export interface OrderClient {
  get(): Promise<OrderData[]>;
}

async function get() {
  return await fetch(
    "https://www.bitstamp.net/api/v2/transactions/btcusd/",
  ).then((x) => x.json());
}

const orderClient: OrderClient = { get };

export default orderClient;
