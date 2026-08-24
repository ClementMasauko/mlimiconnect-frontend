import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import classNames from "classnames";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: ReactNode;
  icon?: ReactNode;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(({ className, leftIcon, icon, error, ...props }, ref) => {
  const leadingIcon = leftIcon ?? icon;
  return (
    <div className="w-full">
      <div className="relative">
        {leadingIcon && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">{leadingIcon}</span>}
        <input
          ref={ref}
          className={classNames(
            "min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-base text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20 sm:text-sm dark:bg-transparent dark:text-white",
            Boolean(leadingIcon) && "pl-10",
            error ? "border-red-500" : "border-gray-200 dark:border-gray-700",
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
