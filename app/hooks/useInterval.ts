import { useEffect, useRef, useLayoutEffect } from "react";

function useInterval(callback: () => void, interval: number | null) {
  const savedCallback = useRef(callback);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (interval === null) return;

    const id = setInterval(() => savedCallback.current(), interval);

    return () => {
      clearInterval(id);
    };
  }, [interval]);
}

export default useInterval;
