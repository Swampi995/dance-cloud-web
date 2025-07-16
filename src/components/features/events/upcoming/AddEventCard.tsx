import React, { memo } from "react";
import { Card } from "@/components/ui/card";
import { CopyPlus } from "lucide-react";

interface AddEventCardProps {
  /** Trigger your create-event flow (router push, modal, etc.) */
  onAdd: () => void;
}

/** Purple gradient tile that invites the user to add a future event */
const AddEventCard: React.FC<AddEventCardProps> = ({ onAdd }) => (
  <Card
    role="button"
    tabIndex={0}
    onClick={onAdd}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onAdd()}
    className="group relative flex aspect-[4/3] h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 shadow-md transition-transform duration-300 hover:scale-[1.03] sm:aspect-video"
  >
    <CopyPlus size={128} className="text-white" aria-label="Add new event" />
  </Card>
);

AddEventCard.displayName = "AddEventCard";
export default memo(AddEventCard);
