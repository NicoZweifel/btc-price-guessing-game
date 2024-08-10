import { ComponentProps } from "react";
import { createPrediction } from "@/app/actions/prediction";
import { ArrowDown, ArrowUp, Button } from "@/components";
import { DIRECTION } from "@/types";

function CreatePredictionForm(props: Omit<ComponentProps<"form">, "action">) {
  return (
    <form {...props} action={createPrediction}>
      <p className={"text-lg text-center pb-2"}>Up or down?</p>

      <div className="flex flex-row gap-2">
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
