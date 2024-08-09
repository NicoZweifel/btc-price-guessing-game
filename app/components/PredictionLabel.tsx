import { Prediction, DIRECTION } from "@/types";
import { ComponentProps } from "react";
import { cn } from "@/utils";
import ArrowUp from "./ArrowUp";
import ArrowDown from "./ArrowDown";

function PredictionLabel({
  prediction,
  className,
  ...props
}: { prediction: Prediction } & ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "py-3 px-10 rounded-lg text-black font-semibold items-center justify-center flex flex-row gap-2",
        prediction.direction == DIRECTION.UP ? "bg-green-700" : "bg-red-700",
        className,
      )}
    >
      {prediction.direction == DIRECTION.UP ? <ArrowUp /> : <ArrowDown />}
      {new Date(prediction.timestamp * 1000).toString()}
    </div>
  );
}

export default PredictionLabel;
