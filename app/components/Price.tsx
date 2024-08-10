"use client";

import { usePrice } from "@/hooks";
import { cn } from "@/utils";
import { ComponentProps } from "react";

function Price({ className, ...props }: ComponentProps<"p">) {
  const [price] = usePrice();
  return (
    <p
      {...props}
      className={cn("text-gray-200 font-semibold text-lg", className)}
    >
      1₿ = {price > 0 ? `${price}$` : "N/A"}
    </p>
  );
}

export default Price;
