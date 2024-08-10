import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function usePrice(): [number, Dispatch<SetStateAction<number>>] {
  const [price, setPrice] = useState(0);
  const prev = useRef(0);

  const [socket, setSocket] = useState<WebSocket>();

  const init = useCallback(
    () => setSocket(new WebSocket("wss://ws.bitstamp.net")),
    [],
  );

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!socket) return;
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

    socket.onclose = () => {
      console.debug("socket closed.");
      init();
    };
    return () => socket.close();
  }, [init, socket]);

  return [price, setPrice];
}

export default usePrice;
