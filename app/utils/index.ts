import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import compareOHLC from "./compareOHLC";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { compareOHLC };
