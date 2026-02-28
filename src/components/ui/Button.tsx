import React from "react";
import classNames from "classnames";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export default function Button({ variant="solid", size="md", className, children, ...rest }: Props) {
  const base = "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-1";
  const variants: Record<string,string> = {
    solid: "bg-brand-500 text-white hover:bg-green-600 px-4 py-2",
    ghost: "bg-transparent text-brand-500 px-2 py-1",
    outline: "border border-gray-300 text-gray-800 px-3 py-1",
  };
  const sizes: Record<string,string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <button className={classNames(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
