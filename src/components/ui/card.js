import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div className={"rounded-xl bg-white shadow p-6 " + className} {...props}>
      {children}
    </div>
  );
}
