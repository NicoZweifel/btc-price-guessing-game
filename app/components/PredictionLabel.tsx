"use client";

import { Prediction, DIRECTION, EvaluatePredictionResult } from "@/types";
import { ComponentProps } from "react";
import { cn } from "@/utils";
import ArrowUp from "./ArrowUp";
import ArrowDown from "./ArrowDown";
import { useCountdown } from "@/hooks";

function PredictionLabel({
  prediction,
  className,
  result,
  ...props
}: {
  prediction: Prediction;
  result?: EvaluatePredictionResult;
} & ComponentProps<"div">) {
  const [seconds] = useCountdown();

  const text = `Your guess currently resolves to: ${result?.value?.toString() ?? "unchanged."}`;

  let end = new Date((prediction.timestamp + 120) * 1000);

  // Price is considered unchanged. We will have to wait another minute.
  if (result && result.value === undefined) {
    end = new Date();
    end.setMinutes(end.getMinutes() + 1);
  }

  // Remove seconds to get time when prediction can be solved.
  end.setSeconds(0);

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
      <div className="flex flex-row gap-2 font-semibold text-lg">
        {prediction.direction == DIRECTION.UP ? <ArrowUp /> : <ArrowDown />}
        {new Date(prediction.timestamp * 1000).toLocaleTimeString() +
          " - " +
          end.toLocaleTimeString()}
      </div>
      {result && (
        <p className="font-bold">
          {text}. {seconds} seconds remaining.
        </p>
      )}
    </div>
  );
}

export default PredictionLabel;
