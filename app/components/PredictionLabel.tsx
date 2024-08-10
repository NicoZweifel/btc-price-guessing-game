"use client";

import { Prediction, DIRECTION, EvaluatePredictionResult } from "@/types";
import { ComponentProps } from "react";
import { cn } from "@/utils";
import ArrowUp from "./ArrowUp";
import ArrowDown from "./ArrowDown";
import { useCountdown } from "@/hooks";

export type PredictionLabelProps = {
  prediction: Prediction;
  result?: EvaluatePredictionResult;
} & ComponentProps<"div">;

function PredictionLabel({
  prediction,
  className,
  result,
  ...props
}: PredictionLabelProps) {
  const [seconds] = useCountdown();

  const value =
    result?.value != undefined ? result.value.toString() : `unchanged`;
  const text = `Your guess currently resolves to: ${value}`;

  let end = new Date((prediction.timestamp + 120) * 1000);
  end.setSeconds(0);

  if (new Date() > end) {
    end = new Date(Date.now() + 60 * 1000);
    end.setSeconds(0);
  }

  return (
    <div
      {...props}
      className={cn(
        "py-3 px-10 flex-col rounded-lg text-black font-semibold ring-1 items-center justify-center flex gap-2",
        prediction.direction == DIRECTION.UP
          ? "bg-green-700 ring-green-900"
          : "bg-red-700 ring-red-900",
        className,
      )}
    >
      <div
        suppressHydrationWarning
        className="flex flex-row gap-2 font-semibold text-lg"
      >
        {prediction.direction == DIRECTION.UP ? <ArrowUp /> : <ArrowDown />}
        {new Date(prediction.timestamp * 1000).toLocaleTimeString() +
          " - " +
          end.toLocaleTimeString()}
      </div>
      {result && (
        <p suppressHydrationWarning className="font-bold">
          {text}. {seconds} seconds remaining.
        </p>
      )}
    </div>
  );
}

export default PredictionLabel;
