import React from "react";
import classNames from "classnames";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={classNames("w-full px-3 py-2 rounded-md border border-gray-200 bg-white dark:bg-transparent", props.className)}
      {...props}
    />
  );
}
