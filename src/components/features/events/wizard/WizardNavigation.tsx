import { FC, memo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  MessageSquareText,
  CalendarDays,
  Sticker,
  Percent,
} from "lucide-react";

type WizardNavigationProps = {
  /** 0-based index of the active step (controlled). If omitted, the component manages its own state. */
  currentStep?: number;
  /** Called when the user selects a step. */
  onStepChange?: (index: number) => void;
  /** Disable clicking on future steps (optional) */
  disableFuture?: boolean;
};

type Step = {
  key: string;
  label: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  { key: "general", label: "General Info", icon: MessageSquareText },
  { key: "date-location", label: "Date & Location", icon: CalendarDays },
  { key: "pass-types", label: "Pass Types", icon: Sticker },
  { key: "discounts", label: "Discounts", icon: Percent },
] as const;

const WizardNavigation: FC<WizardNavigationProps> = ({
  currentStep,
  onStepChange,
  disableFuture = false,
}) => {
  // Uncontrolled fallback
  const [internalStep, setInternalStep] = useState(0);
  const activeIndex =
    typeof currentStep === "number" ? currentStep : internalStep;

  const handleSelect = (index: number) => {
    if (disableFuture && index > activeIndex) return;
    onStepChange?.(index);
    if (typeof currentStep !== "number") setInternalStep(index);
  };

  return (
    <nav aria-label="Event wizard steps">
      <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-2 py-2 sm:grid-cols-4 sm:gap-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeIndex;
          const isDisabled = disableFuture && i > activeIndex;

          return (
            <li key={step.key} className="list-none">
              <button
                type="button"
                onClick={() => handleSelect(i)}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={isDisabled}
                className={[
                  "group relative flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ring-1 transition",
                  "ring-accent/90 hover:bg-accent/60",
                  isActive ? "bg-accent text-white" : "text-neutral-400",
                  isDisabled ? "cursor-not-allowed opacity-60" : "",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  strokeWidth={2}
                  className={["shrink-0", isActive ? "scale-110" : ""].join(
                    " ",
                  )}
                />
                <span className="truncate">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

WizardNavigation.displayName = "WizardNavigation";

export default memo(WizardNavigation);
