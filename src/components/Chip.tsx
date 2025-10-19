import React from "react";

type Props = {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};
export default function Chip({ active, onClick, children, className }: Props){
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip ${active ? "chip--active" : ""} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
