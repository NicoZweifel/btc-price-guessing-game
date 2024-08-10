import { useCallback, useEffect, useState } from "react";

function useSocket(url: string): [WebSocket | undefined, () => void] {
  const [socket, setSocket] = useState<WebSocket>();

  const init = useCallback(() => setSocket(new WebSocket(url)), [url]);

  useEffect(() => {
    return () => socket?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) init();
  }, [init, socket]);

  return [socket, () => setSocket(undefined)];
}

export default useSocket;
