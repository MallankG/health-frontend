import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
