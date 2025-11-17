import { useState } from "react";

export default function WarningBadge({ text, type }) {
  const [showTip, setShowTip] = useState(false);

  const icons = {
    danger: "❌",
    warning: "⚠️",
    low: "🔴",
  };

  const colors = {
    danger: "bg-red-600",
    warning: "bg-amber-500",
    low: "bg-red-700",
  };

  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <span
        className={`
          ${colors[type]} 
          text-white 
          flex items-center gap-1
          text-[10px] sm:text-xs 
          px-2 py-0.5 
          rounded-md 
          whitespace-nowrap 
          shadow 
          cursor-pointer 
          select-none
        `}
      >
        <span>{icons[type]}</span>
        <span className="hidden xs:inline">{text.split(" ")[0]}</span>
      </span>

      {showTip && (
        <div
          className="absolute right-0 z-50 px-3 py-2 text-xs text-white bg-gray-800 rounded shadow-xl  -top-10 whitespace-nowrap"
        >
          {text}
        </div>
      )}
    </div>
  );
}
