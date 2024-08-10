"use client";

import { evaluatePrediction } from "@/app/actions/prediction";
import { Prediction } from "@/types";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import PredictionLabel from "../PredictionLabel";
import { useCountdown } from "@/hooks";

export type EvaluatePredictionFormProps = {
  prediction: Prediction;
} & Omit<ComponentProps<"form">, "action" | "ref">;

function EvaluatePredictionForm({
  prediction,
  ...props
}: EvaluatePredictionFormProps) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(evaluatePrediction, undefined);
  const [seconds] = useCountdown();

  useEffect(() => {
    const predictionResolvable = Date.now() / 1000 - prediction.timestamp >= 60;

    if (!ref.current || !predictionResolvable) return;

    ref.current.requestSubmit();
  }, [prediction, seconds]);

  return (
    <form {...props} ref={ref} action={formAction}>
      <PredictionLabel result={state} prediction={prediction} />
    </form>
  );
}

export default EvaluatePredictionForm;
