import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

function usePrice(): [number, Dispatch<SetStateAction<number>>] {
  const [price, setPrice] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const socket = new WebSocket("wss://ws.bitstamp.net");
    socket.onopen = () => {
      console.debug("socket listening for btc live trades.");

      socket.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_btcusd",
          },
        }),
      );
    };
    socket.onmessage = (x) => {
      const data = JSON.parse(x.data);

      if (!data.data.price) return;

      setPrice(data.data.price);
      prev.current = data.data.price;
    };

    return () => socket.close();
  }, []);

  return [price, setPrice];
}

export default usePrice;
