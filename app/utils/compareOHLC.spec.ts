import { DIRECTION, OHLCData } from "@/types";
import { compareOHLC } from ".";

describe("compareOHLC", () => {
  const first: OHLCData = {
    open: 100,
    high: 120,
    low: 80,
    close: 110,
    volume: 0,
    timestamp: 0,
  };

  it("should return DIRECTION.UP when second close is higher and has higher close than the previous high", () => {
    const second: OHLCData = { ...first, close: 130, high: 140 };
    expect(compareOHLC(first, second)).toBe(DIRECTION.UP);
  });

  it("should return DIRECTION.DOWN when second close is lower and has lower close than the previous low", () => {
    const second: OHLCData = { ...first, close: 70, low: 60 };
    expect(compareOHLC(first, second)).toBe(DIRECTION.DOWN);
  });

  it("should return DIRECTION.UNCHANGED when second close is higher but not higher than the previous high", () => {
    const second: OHLCData = { ...first, close: 115 };
    expect(compareOHLC(first, second)).toBe(DIRECTION.UNCHANGED);
  });

  it("should return DIRECTION.UNCHANGED when second close is lower but not lower than previous low", () => {
    const second: OHLCData = { ...first, close: 105 };
    expect(compareOHLC(first, second)).toBe(DIRECTION.UNCHANGED);
  });

  it("should return DIRECTION.UNCHANGED when close is the same", () => {
    const second: OHLCData = first;
    expect(compareOHLC(first, second)).toBe(DIRECTION.UNCHANGED);
  });
});
