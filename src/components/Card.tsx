import React from "react";

type Props = React.PropsWithChildren<{ outlined?: boolean; className?: string }>;
export default function Card({ outlined, className, children }: Props){
  return (
    <div className={`card ${outlined ? "card--outlined" : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}
