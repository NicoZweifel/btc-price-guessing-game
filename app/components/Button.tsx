import { cn } from "@/utils";
import { ComponentProps } from "react";

const style = ({
  color,
  className,
}: {
  color?: "gray" | "green" | "red";
  className?: string;
}) => {
  const base =
    "font-bold h-12 px-10 ring-1 rounded-lg w-full flex items-center justify-center sm:w-auto";
  let variant = "";

  switch (color) {
    case "green":
      variant = "bg-green-900 ring-green-800 hover:ring-green-900 hover:bg-green-700  text-white";
      break;
    case "red":
      variant = "bg-red-900 ring-red-700 hover:ring-red-900 hover:bg-red-700  text-white";
      break;
    default:
      variant = "bg-gray-900 ring-gray-700 hover:ring-gray-900 hover:bg-gray-700  text-white";
  }

  return cn(base, variant, className);
};

function Button({
  className,
  color,
  children,
  ...props
}: ComponentProps<"button"> & { color?: "gray" | "green" | "red" }) {
  return (
    <button {...props} className={style({ color, className })}>
      {children}
    </button>
  );
}

export default Button;
