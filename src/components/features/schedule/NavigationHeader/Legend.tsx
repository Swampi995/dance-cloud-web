import React, { useState } from "react";

interface LegendProps {
  // Optional callback if the parent needs to be notified of the toggle change.
  onToggleVisibility?: (item: "class" | "event", visible: boolean) => void;
}

export const Legend: React.FC<LegendProps> = ({ onToggleVisibility }) => {
  const [showClass, setShowClass] = useState(true);
  const [showEvent, setShowEvent] = useState(true);

  const toggleClass = () => {
    const newValue = !showClass;
    setShowClass(newValue);
    if (onToggleVisibility) {
      onToggleVisibility("class", newValue);
    }
  };

  const toggleEvent = () => {
    const newValue = !showEvent;
    setShowEvent(newValue);
    if (onToggleVisibility) {
      onToggleVisibility("event", newValue);
    }
  };

  return (
    <div className="mt-2 flex items-center space-x-4 text-xs text-neutral-300 md:mt-0">
      <button
        onClick={toggleClass}
        className="flex items-center space-x-1 focus:outline-none"
      >
        <div
          className={`h-3 w-3 rounded-full border-2 ${
            showClass ? "border-purple-600" : "border-neutral-400"
          }`}
        ></div>
        <span className={`${!showClass ? "opacity-50" : ""}`}>Class</span>
      </button>
      <button
        onClick={toggleEvent}
        className="flex items-center space-x-1 focus:outline-none"
      >
        <div
          className={`h-3 w-3 rounded-full border-2 ${
            showEvent ? "border-purple-300" : "border-neutral-400"
          }`}
        ></div>
        <span className={`${!showEvent ? "opacity-50" : ""}`}>Event</span>
      </button>
    </div>
  );
};
