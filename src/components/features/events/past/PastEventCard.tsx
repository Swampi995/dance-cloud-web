// PastEventCard.tsx
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

/**
 * Props for the PastEventCard component.
 *
 * @interface PastEventCardProps
 * @property {string} image - URL of the event image to display.
 * @property {string} title - Title of the event.
 * @property {string} [location] - Optional location of the event. If omitted or empty, a placeholder space is rendered.
 * @property {string | Date} startDate - Start date/time of the event, as a Date object or an ISO string.
 * @property {string | Date} endDate - End date/time of the event, as a Date object or an ISO string.
 */
export interface PastEventCardProps {
  image: string;
  title: string;
  location?: string;
  startDate: string | Date;
  endDate: string | Date;
}

/**
 * PastEventCard displays a past event with image, title, location, and date/time information.
 * Unlike UpcomingEventCard, it does NOT show live status or an edit button.
 *
 * @component
 * @param {PastEventCardProps} props - Props for the component.
 * @returns {JSX.Element} The rendered event card.
 */
const PastEventCard: React.FC<PastEventCardProps> = ({
  image,
  title,
  location,
  startDate,
  endDate,
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

  // If no location provided or it's just whitespace, render a non-breaking space
  const renderedLocation = location?.trim() ? location : "\u00A0";

  return (
    <Card className="relative w-full overflow-hidden rounded-2xl shadow-md">
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
      </CardContent>
    </Card>
  );
};

// Set a display name for React DevTools
PastEventCard.displayName = "PastEventCard";

// Export a memoized version to prevent unnecessary re-renders
export default memo(PastEventCard);
