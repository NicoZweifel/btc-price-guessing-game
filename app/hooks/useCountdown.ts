import { Dispatch, SetStateAction, useState } from "react";
import useInterval from "./useInterval";

const getCountdown = (interval: number) => interval - new Date().getSeconds();

function useCountdown(
  interval: number = 60,
): [number, Dispatch<SetStateAction<number>>] {
  const [seconds, setSeconds] = useState<number>(getCountdown(interval));

  useInterval(() => {
    setSeconds(getCountdown(interval));
  }, 1000);

  return [seconds, setSeconds];
}

export default useCountdown;
