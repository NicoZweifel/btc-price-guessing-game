"use client";

import { createPlayer } from "@/app/actions/player";
import Button from "@/components/Button";
import { cn } from "@/utils";
import { ComponentProps } from "react";
import { useFormState } from "react-dom";

function CreatePredictionForm({
  className,
  ...props
}: Omit<ComponentProps<"form">, "action">) {
  const [state, formAction] = useFormState(createPlayer, undefined);
  return (
    <form
      {...props}
      className={cn(
        "p-6 border rounded-lg shadow bg-gray-800 border-gray-700",
        className,
      )}
      action={formAction}
    >
      <label
        htmlFor="player"
        className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Player name:
      </label>
      <input
        type="text"
        name="player"
        className="mt-2 border text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-gray-900 focus:border-gray-900"
        placeholder="John"
        required
      />
      <div className="flex flex-col gap-2">
        <Button
          aria-label="create player"
          type="submit"
          className="mt-6 px-4 text-sm"
        >
          Play
        </Button>
        {state?.message && <p className="pt-2 text-red-600">{state.message}</p>}
      </div>
    </form>
  );
}

export default CreatePredictionForm;
