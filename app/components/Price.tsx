"use client";

import { usePrice } from "@/hooks";
import { cn } from "@/utils";
import { ComponentProps } from "react";

export type PriceProps = ComponentProps<"p"> & {
  initialPrice: number;
};

function Price({ className, initialPrice, ...props }: PriceProps) {
  const [price] = usePrice();
  return (
    <p
      {...props}
      className={cn("text-gray-200 font-semibold text-lg", className)}
    >
      1₿ = {price > 0 ? `${price}$` : initialPrice > 0 ? `${initialPrice}$` : "N/A"}
    </p>
  );
}

export default Price;
