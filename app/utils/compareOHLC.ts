import { DIRECTION, OHLCData } from "@/types";

function compareOHLC(first: OHLCData, second: OHLCData): DIRECTION {
  const isUp = second.close > first.close;
  const isDown = second.close < first.close;
  const isHigherThanHigh = second.close > first.high;
  const isLowerThanLow = second.close < first.low;

  if (isUp && isHigherThanHigh && !isLowerThanLow) {
    return DIRECTION.UP;
  } else if (isDown && isLowerThanLow && !isHigherThanHigh) {
    return DIRECTION.DOWN;
  }

  return DIRECTION.UNCHANGED;
}

export default compareOHLC;
