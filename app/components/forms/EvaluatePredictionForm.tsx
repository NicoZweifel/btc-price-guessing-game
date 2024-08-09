"use client";

import { evaluatePrediction } from "@/app/actions/prediction";
import { useInterval } from "@/hooks";
import { Prediction } from "@/types";
import { cn } from "@/utils";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { useFormState } from "react-dom";

export type EvaluatePredictionFormProps = {
  prediction?: Prediction;
} & ComponentProps<"div">;

const getCountdown = () => 60 - new Date().getSeconds();

function EvaluatePredictionForm({
  prediction,
  className,
  ...props
}: EvaluatePredictionFormProps) {
  const [seconds, setSeconds] = useState<number>(getCountdown());
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(evaluatePrediction, undefined);

  useInterval(() => {
    setSeconds(getCountdown());
  }, 1000);

  const header = !prediction ? `Up or down(${seconds})?` : "Your guess:";

  useEffect(() => {
    const predictionResolvable =
      prediction && Date.now() / 1000 - prediction?.timestamp >= 60;

    if (prediction && ref.current && predictionResolvable)
      ref.current.requestSubmit();
  }, [prediction, seconds]);

  return (
    <form ref={ref} action={formAction}>
      <p
        {...props}
        suppressHydrationWarning
        className={cn("text-lg  pb-2", className)}
      >
        {header}
      </p>
      {prediction && (
        <>
          <p>guess resolved: {state?.closed?.toString() ?? "false"}</p>
          <p>temporary result: {state?.result?.toString() ?? "Unchanged"}</p>
        </>
      )}
    </form>
  );
}

export default EvaluatePredictionForm;
