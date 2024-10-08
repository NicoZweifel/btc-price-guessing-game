import { Prediction, DIRECTION, OHLCData } from "@/types";
import { OHLCClient } from "@/clients";
import { predictionService } from ".";

const mock: OHLCData = {
  timestamp: 0,
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  volume: 0,
};

const mockData: OHLCData[] = [mock, mock, mock];

describe("evaluatePrediction", () => {
  let mockOhclClient: jest.Mocked<OHLCClient>;
  let mockCompareOHLC: jest.Mock;
  let prediction: Prediction;

  beforeEach(() => {
    mockOhclClient = { get: jest.fn() } as jest.Mocked<OHLCClient>;
    mockCompareOHLC = jest.fn();
    prediction = {
      player: "testPlayer",
      timestamp: 1722928684,
      direction: DIRECTION.UP,
    };
  });

  it("should return undefined for < 2 candles", async () => {
    mockOhclClient.get.mockResolvedValue([]);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toBeUndefined();
    expect(mockCompareOHLC).toHaveBeenCalledTimes(0);
  });

  it("should return true for correct UP prediction", async () => {
    mockOhclClient.get.mockResolvedValue(mockData);
    mockCompareOHLC.mockReturnValue(DIRECTION.UP);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toBeTruthy();
    expect(mockCompareOHLC).toHaveBeenCalledTimes(1);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
  });

  it("should return true for correct DOWN prediction", async () => {
    prediction.direction = DIRECTION.DOWN;

    mockOhclClient.get.mockResolvedValue(mockData);
    mockCompareOHLC.mockReturnValue(DIRECTION.DOWN);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({ resolved: true, value: true });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(1);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
  });

  it("should return false for incorrect prediction", async () => {
    prediction.direction = DIRECTION.DOWN;

    mockOhclClient.get.mockResolvedValue(mockData);
    mockCompareOHLC.mockReturnValue(DIRECTION.UP);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({ resolved: true, value: false });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(1);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
  });

  it("should return unresolved result if < 3 candles", async () => {
    mockOhclClient.get.mockResolvedValue([mockData[0], mockData[1]]);
    mockCompareOHLC.mockReturnValue(DIRECTION.UP);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({
      resolved: false,
      value: true,
    });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(1);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
  });

  it("should return undefined unresolved result if last candle is UNCHANGED", async () => {
    mockOhclClient.get.mockResolvedValue(mockData);

    mockCompareOHLC.mockReturnValueOnce(DIRECTION.UNCHANGED);
    mockCompareOHLC.mockReturnValueOnce(DIRECTION.UNCHANGED);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({
      resolved: false,
    });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(2);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[2]);
  });

  it("should return third candle result if second candle is UNCHANGED", async () => {
    mockOhclClient.get.mockResolvedValue(mockData);

    mockCompareOHLC.mockReturnValueOnce(DIRECTION.UNCHANGED);
    mockCompareOHLC.mockReturnValueOnce(DIRECTION.UP);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({
      resolved: true,
      value: true,
    });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(2);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[2]);
  });

  it("should return unresolved UNCHANGED result if prediction is younger than 60 seconds", async () => {
    mockOhclClient.get.mockResolvedValue(mockData);
    prediction.timestamp = Math.trunc(Date.now() / 1000) - 30;

    mockCompareOHLC.mockReturnValueOnce(DIRECTION.UP);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({
      resolved: false,
      value: true,
    });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(1);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
  });

  it("should return unresolved result if prediction is younger than 60 seconds", async () => {
    mockOhclClient.get.mockResolvedValue(mockData);
    prediction.timestamp = Math.trunc(Date.now() / 1000) - 30;

    mockCompareOHLC.mockReturnValueOnce(DIRECTION.UP);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({
      resolved: false,
      value: true,
    });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(1);
    expect(mockCompareOHLC).toHaveBeenCalledWith(mockData[0], mockData[1]);
  });

  it("should return unresolved undefined if result if last candle is UNCHANGED and younger than 60 seconds", async () => {
    let timestamp = Math.trunc(Date.now() / 1000) - 30;
    const mockDataWithOldCandle = [
      mockData[0],
      { ...mockData[1], timestamp }, // younger than 60 seconds
    ];

    mockOhclClient.get.mockResolvedValue(mockDataWithOldCandle);
    mockCompareOHLC.mockReturnValueOnce(DIRECTION.UNCHANGED);

    const result = await predictionService.evaluatePrediction(
      prediction,
      mockOhclClient,
      mockCompareOHLC,
    );

    expect(result).toStrictEqual({
      resolved: false,
      value: undefined,
    });
    expect(mockCompareOHLC).toHaveBeenCalledTimes(1);
    expect(mockCompareOHLC).toHaveBeenCalledWith(...mockDataWithOldCandle);
  });
});
