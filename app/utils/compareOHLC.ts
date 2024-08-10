import { DIRECTION, OHLCData } from "@/types";

function compareOHLC(first: OHLCData, second: OHLCData): DIRECTION {
  const isUp = second.close > first.close;
  const isDown = second.close < first.close;
  const isHigherHigh = second.close > first.high;
  const isLowerLow = second.close < first.low;

  if (isUp && isHigherHigh && !isLowerLow) {
    return DIRECTION.UP;
  } else if (isDown && isLowerLow && !isHigherHigh) {
    return DIRECTION.DOWN;
  }

  return DIRECTION.UNCHANGED;
}

export default compareOHLC;
