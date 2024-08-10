"use client";

import { evaluatePrediction } from "@/app/actions/prediction";
import { EvaluatePredictionResult, Prediction } from "@/types";
import { ComponentProps, RefObject, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import PredictionLabel from "../PredictionLabel";
import { useCountdown } from "@/hooks";

export type EvaluatePredictionFormProps = {
  prediction: Prediction;
} & Omit<ComponentProps<"form">, "action" | "ref">;

function useEvaluatePredictionForm({
  prediction,
  ref,
}: Pick<EvaluatePredictionFormProps, "prediction"> & {
  ref: RefObject<HTMLFormElement>;
}): [EvaluatePredictionResult | undefined, () => void] {
  const [state, formAction] = useFormState(evaluatePrediction, undefined);
  const [seconds] = useCountdown();

  useEffect(() => {
    // Don't submit prediction if the current minute has not concluded.
    const predictionSubmittable =
      (prediction.timestamp +
        (60 - new Date(prediction.timestamp * 1000).getSeconds())) *
        1000 <=
      Date.now();

    if (!ref.current || !predictionSubmittable) return;

    ref.current.requestSubmit();
  }, [prediction, ref, seconds]);

  return [state, formAction];
}

function EvaluatePredictionForm({
  prediction,
  ...props
}: EvaluatePredictionFormProps) {
  const ref = useRef<HTMLFormElement>(null);

  const [state, formAction] = useEvaluatePredictionForm({ prediction, ref });

  return (
    <form {...props} ref={ref} action={formAction}>
      <PredictionLabel result={state} prediction={prediction} />
    </form>
  );
}

export default EvaluatePredictionForm;
