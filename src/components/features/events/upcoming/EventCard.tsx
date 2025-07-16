import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CircleDot } from "lucide-react";

export interface EventCardProps {
  image: string;
  title: string;
  location?: string;
  startDate: string | Date;
  endDate: string | Date;
  onEdit?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  image,
  title,
  location,
  startDate,
  endDate,
  onEdit,
}) => {
  const eventStart =
    typeof startDate === "string" ? new Date(startDate) : startDate;
  const eventEnd = typeof endDate === "string" ? new Date(endDate) : endDate;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(eventStart);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const formattedTimeRange = `${timeFormatter.format(
    eventStart,
  )} – ${timeFormatter.format(eventEnd)}`;

  const now = new Date();
  const isLive = now >= eventStart && now <= eventEnd;

  const renderedLocation = location?.trim() ? location : "\u00A0"; // non-breaking space keeps the line’s height

  return (
    <Card className="relative w-full overflow-hidden rounded-2xl shadow-md">
      {/* Live Now badge */}
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

      <div className="w-full overflow-hidden">
        <div className="relative aspect-[4/3] bg-gray-100 sm:aspect-video">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      <CardContent className="flex flex-col gap-1 bg-sidebar/70 p-4">
        <h2 className="truncate text-lg font-semibold leading-tight sm:text-xl">
          {title}
        </h2>

        <p className="min-h-[1.25rem] truncate text-sm text-muted-foreground">
          {renderedLocation}
        </p>

        {isLive ? (
          <div className="flex items-center gap-1 text-sm font-medium text-red-600">
            <Clock size={14} className="shrink-0" aria-label="Clock icon" />
            <span>Happening Now</span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 text-sm font-medium text-gray-500">
            {/* Date row */}
            <div className="flex items-center gap-1">
              <Calendar
                size={14}
                className="shrink-0 text-muted-foreground"
                aria-label="Calendar icon"
              />
              <span>{formattedDate}</span>
            </div>
            {/* Time range row */}
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

      <Button
        variant="default"
        size="sm"
        onClick={onEdit}
        className="absolute bottom-2 right-2"
      >
        Edit
      </Button>
    </Card>
  );
};

EventCard.displayName = "EventCard";

export default memo(EventCard);
