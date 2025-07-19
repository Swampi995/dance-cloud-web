import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CircleDot } from "lucide-react";

/**
 * Props for the UpcomingEventCard component.
 *
 * @interface UpcomingEventCardProps
 * @property {string} image - URL of the event image to display.
 * @property {string} title - Title of the event.
 * @property {string} [location] - Optional location of the event. If omitted or empty, a placeholder space is rendered.
 * @property {string | Date} startDate - Start date/time of the event, as a Date object or an ISO string.
 * @property {string | Date} endDate - End date/time of the event, as a Date object or an ISO string.
 * @property {() => void} [onEdit] - Optional callback invoked when the "Edit" button is clicked.
 */
export interface UpcomingEventCardProps {
  image: string;
  title: string;
  location?: string;
  startDate: string | Date;
  endDate: string | Date;
  onEdit?: () => void;
}

/**
 * UpcomingEventCard displays an event with image, title, location, date/time information,
 * and an optional "Live Now" badge when the event is in progress.
 *
 * @component
 * @param {UpcomingEventCardProps} props - Props for the component.
 * @returns {JSX.Element} The rendered event card.
 */
const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  image,
  title,
  location,
  startDate,
  endDate,
  onEdit,
}) => {
  // Normalize start and end dates into Date objects
  const eventStart =
    typeof startDate === "string" ? new Date(startDate) : startDate;
  const eventEnd = typeof endDate === "string" ? new Date(endDate) : endDate;

  // Format the event date (e.g., "Jul 19, 2025")
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(eventStart);

  // Create a formatter for the time portion (e.g., "3:00 PM")
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  // Combine formatted start and end times into a range string
  const formattedTimeRange = `${timeFormatter.format(
    eventStart,
  )} – ${timeFormatter.format(eventEnd)}`;

  // Determine if the event is currently happening
  const now = new Date();
  const isLive = now >= eventStart && now <= eventEnd;

  // If no location provided or it's just whitespace, render a non-breaking space
  const renderedLocation = location?.trim() ? location : "\u00A0";

  return (
    <Card className="relative w-full overflow-hidden rounded-2xl shadow-md">
      {/* Render "Live Now" badge when event is live */}
      {isLive && (
        <div className="absolute left-2 top-2 z-20 flex items-center gap-1 rounded-full border border-red-600 bg-white/90 px-2 py-0.5 text-xs font-semibold text-red-600 backdrop-blur">
          <CircleDot
            size={10}
            className="shrink-0 text-red-600"
            aria-label="Live icon"
          />
          <span>Live Now</span>
        </div>
      )}

      {/* Event image */}
      <div className="w-full overflow-hidden">
        <div className="relative aspect-[4/3] bg-black sm:aspect-video">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Card content: title, location, and date/time info */}
      <CardContent className="flex flex-col gap-1 bg-sidebar/70 p-4">
        <h2 className="truncate text-lg font-semibold leading-tight sm:text-xl">
          {title}
        </h2>

        {/* Render location or placeholder to maintain spacing */}
        <p className="min-h-[1.25rem] truncate text-sm text-muted-foreground">
          {renderedLocation}
        </p>

        {/* If event is live, show "Happening Now"; otherwise, show date and time range */}
        {isLive ? (
          <div className="flex items-center gap-1 text-sm font-medium text-red-600">
            <Clock size={14} className="shrink-0" aria-label="Clock icon" />
            <span>Happening Now</span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 text-sm font-medium text-gray-500">
            {/* Date row with calendar icon */}
            <div className="flex items-center gap-1">
              <Calendar
                size={14}
                className="shrink-0 text-muted-foreground"
                aria-label="Calendar icon"
              />
              <span>{formattedDate}</span>
            </div>
            {/* Time range row with clock icon */}
            <div className="flex items-center gap-1">
              <Clock
                size={14}
                className="shrink-0 text-muted-foreground"
                aria-label="Clock icon"
              />
              <span>{formattedTimeRange}</span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit button in bottom-right corner */}
      <Button
        variant="default"
        size="sm"
        onClick={onEdit}
        className="absolute bottom-2 right-2 rounded-[6px]"
      >
        Edit
      </Button>
    </Card>
  );
};

// Set a display name for React DevTools
UpcomingEventCard.displayName = "UpcomingEventCard";

// Export a memoized version to prevent unnecessary re-renders
export default memo(UpcomingEventCard);
