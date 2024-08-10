"use client";

import { ComponentProps } from "react";
import { createPrediction } from "@/app/actions/prediction";
import { ArrowDown, ArrowUp, Button } from "@/components";
import { DIRECTION } from "@/types";
import { useCountdown } from "@/hooks";
import { cn } from "@/utils";

function CreatePredictionForm({
  className,
  ...props
}: Omit<ComponentProps<"form">, "action">) {
  const [seconds] = useCountdown();
  return (
    <form
      {...props}
      className={cn("flex flex-col gap-2", className)}
      action={createPrediction}
    >
      <p className={"text-lg font-semibold text-center"}>Up or down?</p>
      <p suppressHydrationWarning className={"font-bold text-center"}>
        {seconds}s remaining to submit a guess.
      </p>
      <div className="flex flex-row justify-center gap-2">
        <Button
          type="submit"
          name="direction"
          value={DIRECTION.UP}
          color="green"
        >
          <ArrowUp />
        </Button>
        <Button
          type="submit"
          name="direction"
          value={DIRECTION.DOWN}
          color="red"
        >
          <ArrowDown />
        </Button>
      </div>
    </form>
  );
}

export default CreatePredictionForm;
