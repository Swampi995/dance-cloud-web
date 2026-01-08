import React, { memo } from "react";
import { Card } from "@/components/ui/card";
import { CopyPlus } from "lucide-react";

/**
 * Props for AddEventCard component.
 * @interface AddEventCardProps
 */
interface AddEventCardProps {
  /**
   * Callback invoked when the user activates the add event card (click or keypress).
   */
  onAdd: () => void;
}

/**
 * A reusable card component that displays a plus icon and invokes a callback
 * when clicked or activated via keyboard.
 *
 * @component
 * @param {AddEventCardProps} props - Component props.
 * @param {() => void} props.onAdd - Function to call when adding an event.
 * @returns {JSX.Element} The rendered AddEventCard component.
 */
const AddEventCard: React.FC<AddEventCardProps> = ({ onAdd }) => (
  <Card
    // Make the card accessible as a button
    role="button"
    tabIndex={0}
    // Handle mouse click
    onClick={onAdd}
    // Handle keyboard activation (Enter or Space)
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAdd()}
    // Styling classes for layout, appearance, and hover effect
    className="group relative flex aspect-[4/3] h-full min-h-[295px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 shadow-md transition-transform duration-300 hover:scale-[1.03] sm:aspect-video"
  >
    {/* Icon indicating addition of a new event */}
    <CopyPlus size={128} className="text-white" aria-label="Add new event" />
  </Card>
);

// Set a readable display name for debugging purposes
AddEventCard.displayName = "AddEventCard";

// Export a memoized version to prevent unnecessary re-renders
export default memo(AddEventCard);
