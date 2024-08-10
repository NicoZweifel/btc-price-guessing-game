import { Prediction, DIRECTION, EvaluatePredictionResult } from "@/types";
import { ComponentProps } from "react";
import { cn } from "@/utils";
import ArrowUp from "./ArrowUp";
import ArrowDown from "./ArrowDown";

function PredictionLabel({
  prediction,
  className,
  result,
  ...props
}: {
  prediction: Prediction;
  result?: EvaluatePredictionResult;
} & ComponentProps<"div">) {
  const text = `Your guess currently resolves to: ${result?.value?.toString() ?? "unchanged."}`;
  return (
    <div
      {...props}
      className={cn(
        "py-3 px-10 flex-col rounded-lg text-black font-semibold items-center justify-center flex gap-2",
        prediction.direction == DIRECTION.UP ? "bg-green-700" : "bg-red-700",
        className,
      )}
    >
      <p {...props} suppressHydrationWarning>
        {text}
      </p>
      <div className="flex flex-row gap-2">
        {prediction.direction == DIRECTION.UP ? <ArrowUp /> : <ArrowDown />}
        {new Date(prediction.timestamp * 1000).toString()}
      </div>
    </div>
  );
}

export default PredictionLabel;
