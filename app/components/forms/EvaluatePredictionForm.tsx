"use client";

import { evaluatePrediction } from "@/app/actions/prediction";
import { useInterval } from "@/hooks";
import { Prediction } from "@/types";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import PredictionLabel from "../PredictionLabel";

export type EvaluatePredictionFormProps = {
  prediction: Prediction;
} & Omit<ComponentProps<"form">, "action" | "ref">;

const getCountdown = () => 60 - new Date().getSeconds();

function EvaluatePredictionForm({
  prediction,
  ...props
}: EvaluatePredictionFormProps) {
  const [seconds, setSeconds] = useState<number>(getCountdown());
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(evaluatePrediction, undefined);

  useInterval(() => {
    setSeconds(getCountdown());
  }, 1000);

  useEffect(() => {
    const predictionResolvable = Date.now() / 1000 - prediction.timestamp >= 60;

    if (!ref.current || !predictionResolvable) return;

    ref.current.requestSubmit();
  }, [prediction, seconds]);

  return (
    <form {...props} ref={ref} action={formAction}>
       <p>{seconds}</p>
      <PredictionLabel result={state} prediction={prediction} />
    </form>
  );
}

export default EvaluatePredictionForm;
