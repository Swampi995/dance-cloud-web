import { memo, useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";
import { ClubClassType } from "@/schemas/classes";
import { ClubEventType } from "@/schemas/events";

interface DayCalendarProps {
  /**
   * The date to display. Defaults to the current date if not provided.
   */
  date?: Date;
  classesData: ClubClassType[];
  eventsData: ClubEventType[];
}

/**
 * Formats the given hour and minute into a 12‑hour clock time string.
 */
function formatTime(hour: number, minute: number): string {
  const period = hour < 12 ? "AM" : "PM";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

interface DayIntervalProps {
  interval: { hour: number; minute: number };
  isCurrent: boolean;
  index: number;
  availableWidth: number;
  height: number;
}

/**
 * DayInterval renders a single half‑hour interval.
 */
const DayInterval: React.FC<DayIntervalProps> = ({
  interval,
  isCurrent,
  index,
  availableWidth,
  height,
}) => {
  const baseClasses =
    "flex flex-col rounded-xl border-[0.5px] p-1 text-sm font-semibold hover:bg-purple-300/10 hover:text-neutral-100";
  const textColor = isCurrent ? "text-neutral-300" : "text-neutral-400";
  const bgClasses = !isCurrent
    ? index % 2 === 0
      ? "bg-neutral-900/50"
      : "bg-sidebar/70"
    : "bg-purple-900/30";

  return (
    <Card
      style={{ width: availableWidth, height }}
      className={`${baseClasses} ${bgClasses} ${textColor}`}
    >
      <CardHeader className="p-0">
        <div className="text-left text-sm font-semibold">
          {formatTime(interval.hour, interval.minute)}
        </div>
      </CardHeader>
      {/* This CardContent remains empty since our overlay will display blocks */}
      <CardContent className="flex-1 overflow-auto p-1" />
    </Card>
  );
};

/**
 * VisualBlock represents either an event or a class with start/end times (in minutes).
 */
interface VisualBlock {
  id: string;
  name: string;
  startMinutes: number;
  endMinutes: number;
  type: "event" | "class";
  color: string; // e.g. "bg-blue-300" for events or "bg-purple-900" for classes
  borderColor: string;
  borderIntensity: string;
}

/**
 * PositionedBlock extends VisualBlock with layout information.
 */
interface PositionedBlock extends VisualBlock {
  col: number;
  totalCols: number;
}

/**
 * computeLayout processes an array of VisualBlock items and assigns each a column index and total column count
 * so that overlapping blocks are rendered side by side.
 */
function computeLayout(blocks: VisualBlock[]): PositionedBlock[] {
  const sorted = blocks.slice().sort((a, b) => {
    if (a.startMinutes !== b.startMinutes)
      return a.startMinutes - b.startMinutes;
    return a.endMinutes - b.endMinutes;
  });
  const positioned: PositionedBlock[] = [];
  const active: PositionedBlock[] = [];

  for (const block of sorted) {
    // Remove blocks that have finished before the current block starts.
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].endMinutes <= block.startMinutes) {
        active.splice(i, 1);
      }
    }
    // Find the lowest column index that isn’t already used by an active block.
    const usedCols = new Set(active.map((b) => b.col));
    let col = 0;
    while (usedCols.has(col)) {
      col++;
    }
    const positionedBlock: PositionedBlock = {
      ...block,
      col,
      totalCols: active.length + 1,
    };
    active.push(positionedBlock);
    positioned.push(positionedBlock);
    // Update totalCols for every active block.
    const currentTotal = active.length;
    for (const b of active) {
      b.totalCols = currentTotal;
    }
  }
  return positioned;
}

/**
 * DayCalendar displays a day view with 48 half‑hour intervals.
 * It overlays visual blocks representing events and classes, and if overlapping,
 * displays them horizontally side by side.
 */
const DayCalendar: React.FC<DayCalendarProps> = ({
  date = new Date(),
  classesData,
  eventsData,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { open, openMobile, isMobile } = useSidebar();

  const isSidebarOpen = useMemo(
    () => (isMobile ? openMobile : open),
    [isMobile, openMobile, open],
  );

  const isSmallScreen = useMemo(
    () => (isSidebarOpen ? windowWidth - 255 : windowWidth) < 1280,
    [isSidebarOpen, windowWidth],
  );

  const availableWidth = useMemo(
    () =>
      isSmallScreen
        ? windowWidth - 80 - (isSidebarOpen ? 255 : 0)
        : windowWidth - 32 - 80 - (isSidebarOpen ? 255 : 0),
    [windowWidth, isSmallScreen, isSidebarOpen],
  );

  const now = useMemo(() => new Date(), []);
  const isToday = useMemo(
    () =>
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate(),
    [date, now],
  );

  // Generate 48 half‑hour intervals.
  const intervals = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        hour: Math.floor(i / 2),
        minute: i % 2 === 0 ? 0 : 30,
      })),
    [],
  );

  const currentIntervalIndex = useMemo(
    () =>
      isToday ? now.getHours() * 2 + (now.getMinutes() >= 30 ? 1 : 0) : -1,
    [isToday, now],
  );

  // Fixed height for each interval; the total container height represents a full day (1440 minutes).
  const intervalHeight = 128;
  const containerHeight = intervals.length * intervalHeight;

  // Refs and mouse handlers for the time indicator.
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !indicatorRef.current || !labelRef.current)
        return;
      const rect = containerRef.current.getBoundingClientRect();
      const cursorY = e.clientY - rect.top;
      indicatorRef.current.style.top = `${cursorY}px`;
      indicatorRef.current.style.display = "block";

      const totalMinutes = Math.floor((cursorY / containerHeight) * 1440);
      const clampedMinutes = Math.max(0, Math.min(totalMinutes, 1439));
      const hour = Math.floor(clampedMinutes / 60);
      const minute = clampedMinutes % 60;
      labelRef.current.textContent = formatTime(hour, minute);
    },
    [containerHeight],
  );

  const handleMouseLeave = useCallback(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.display = "none";
    }
  }, []);

  // Build visual blocks for events and classes.
  const visualBlocks: VisualBlock[] = [];
  const dayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
  );

  // Process events: adjust for events that span multiple days.
  eventsData.forEach((event: ClubEventType) => {
    const eventStart = new Date(event.startDate.seconds * 1000);
    const eventEnd = new Date(event.endDate.seconds * 1000);
    // Skip events that do not overlap the current day.
    if (eventEnd < dayStart || eventStart > dayEnd) {
      return;
    }
    // Determine the effective start and end times for the day.
    const effectiveStart = eventStart < dayStart ? dayStart : eventStart;
    const effectiveEnd = eventEnd > dayEnd ? dayEnd : eventEnd;
    const startMinutes =
      effectiveStart.getHours() * 60 + effectiveStart.getMinutes();
    const endMinutes = effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes();
    visualBlocks.push({
      id: event.id,
      name: event.name,
      startMinutes,
      endMinutes,
      type: "event",
      color: "bg-blue-300/20",
      borderColor: "blue",
      borderIntensity: "300",
    });
  });

  // Process classes.
  classesData.forEach((cls: ClubClassType) => {
    if (!cls.schedule) return;
    cls.schedule.forEach(
      (scheduleItem: { day: number; hour: number; minute: number }) => {
        if (scheduleItem.day === date.getDay()) {
          const startMinutes = scheduleItem.hour * 60 + scheduleItem.minute;
          // Assume duration is in minutes (or parsed if a string).
          const durationMinutes =
            typeof cls.duration === "string"
              ? parseInt(cls.duration, 10)
              : cls.duration;
          visualBlocks.push({
            id: `${cls.id}-${scheduleItem.hour}-${scheduleItem.minute}`,
            name: cls.name,
            startMinutes,
            endMinutes: startMinutes + durationMinutes,
            type: "class",
            color: "bg-purple-300/30",
            borderColor: "purple",
            borderIntensity: "300",
          });
        }
      },
    );
  });

  // Compute horizontal layout for overlapping blocks.
  const positionedBlocks = computeLayout(visualBlocks);

  return (
    <Card className="border-0" style={{ width: availableWidth }}>
      <CardContent className="p-0">
        <div className="relative" style={{ height: containerHeight }}>
          <div
            ref={containerRef}
            className="grid grid-cols-1"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {intervals.map((interval, i) => {
              const isCurrentInterval = i === currentIntervalIndex;
              return (
                <DayInterval
                  key={i}
                  interval={interval}
                  isCurrent={isCurrentInterval}
                  index={i}
                  availableWidth={availableWidth}
                  height={intervalHeight}
                />
              );
            })}
          </div>
          {/* Overlay container for duration blocks */}
          <div className="pointer-events-none absolute inset-0">
            {positionedBlocks.map((block) => {
              const top = (block.startMinutes / 1440) * containerHeight;
              const height =
                ((block.endMinutes - block.startMinutes) / 1440) *
                containerHeight;
              // Reserve a horizontal padding of 10px (5px each side).
              const horizontalPadding = 0;
              const availableOverlayWidth = availableWidth - horizontalPadding;
              const left =
                (availableOverlayWidth * block.col) / block.totalCols;
              const width = availableOverlayWidth / block.totalCols;
              return (
                <div
                  key={block.id}
                  className={`${block.color} absolute rounded-xl border-[0.5px] border-l-4 border-${block.borderColor}-${block.borderIntensity} border-l-${block.borderColor}-${block.borderIntensity} pl-2 pt-8 text-left text-xs sm:text-sm md:text-base`}
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    left: `${left}px`,
                    width: `${width}px`,
                  }}
                >
                  {block.name}
                </div>
              );
            })}
          </div>
          <div
            ref={indicatorRef}
            style={{
              position: "absolute",
              left: 0,
              right: 4,
              pointerEvents: "none",
              display: "none",
            }}
          >
            <div
              ref={labelRef}
              className="rounded-full text-purple-500"
              style={{
                position: "absolute",
                right: 0,
                transform: "translateY(-50%)",
                fontSize: "0.75rem",
              }}
            />
            <hr className="mr-14 border-t-[0.25px] border-purple-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

DayCalendar.displayName = "DayCalendar";

export default memo(DayCalendar);
