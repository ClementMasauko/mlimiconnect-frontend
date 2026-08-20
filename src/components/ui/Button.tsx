import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import classNames from "classnames";

type ButtonVariant = "primary" | "solid" | "ghost" | "outline" | "destructive" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  children?: ReactNode;
};

export default function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  asChild = false,
  ...rest
}: Props) {
  const base = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-green-700 text-white shadow-sm hover:bg-green-800 hover:shadow",
    solid: "bg-green-700 text-white shadow-sm hover:bg-green-800 hover:shadow",
    ghost: "bg-transparent text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    link: "bg-transparent text-green-700 underline-offset-4 hover:underline dark:text-green-400",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
    icon: "h-10 w-10 p-0",
  };
  const classes = classNames(base, variants[variant], sizes[size], className);

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, { className: classNames(classes, child.props.className) });
  }

  return <button className={classes} {...rest}>{children}</button>;
}
