import { memo, useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { useWindowDimensions } from "@/hooks/use-window-dimensions";

interface DayCalendarProps {
  /**
   * The date to display. Defaults to the current date if not provided.
   */
  date?: Date;
}

/**
 * Formats the given hour and minute into a 12-hour clock time string.
 *
 * @param {number} hour - The hour in 24-hour format.
 * @param {number} minute - The minute.
 * @returns {string} The formatted time string.
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
 * DayInterval renders a single time interval using the Card, CardHeader, and CardContent
 * structure. Its styling logic mimics the MonthDay component.
 */
const DayInterval: React.FC<DayIntervalProps> = ({
  interval,
  isCurrent,
  index,
  availableWidth,
  height,
}) => {
  const baseClasses =
    "rounded-xl border-[0.5px] p-1 text-sm font-semibold hover:bg-purple-300/10 hover:text-neutral-100";
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
      <CardContent className="p-0" />
    </Card>
  );
};

/**
 * DayCalendar displays a day view with 48 half-hour intervals.
 * It now uses a grid of DayInterval cards to mimic the structure of MonthCalendar.
 *
 * @param {DayCalendarProps} props - The component properties.
 * @param {Date} [props.date=new Date()] - The date to display. Defaults to the current date.
 * @returns {JSX.Element} The rendered day calendar component.
 */
const DayCalendar: React.FC<DayCalendarProps> = ({ date = new Date() }) => {
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

  // Define a fixed height for each interval card (as used previously with "h-32").
  const intervalHeight = 128;

  // Refs for the mouse position indicator.
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !indicatorRef.current || !labelRef.current)
      return;
    const rect = containerRef.current.getBoundingClientRect();
    const cursorY = e.clientY - rect.top;
    // Update the indicator position and display it.
    indicatorRef.current.style.top = `${cursorY}px`;
    indicatorRef.current.style.display = "block";

    // Calculate the time based on the cursor's position.
    const containerHeight = containerRef.current.offsetHeight;
    const totalMinutes = Math.floor((cursorY / containerHeight) * 1440);
    const clampedMinutes = Math.max(0, Math.min(totalMinutes, 1439));
    const hour = Math.floor(clampedMinutes / 60);
    const minute = clampedMinutes % 60;
    labelRef.current.textContent = formatTime(hour, minute);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.display = "none";
    }
  }, []);

  return (
    <Card className="border-0" style={{ width: availableWidth }}>
      <CardContent className="p-0">
        <div className="relative">
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
          {/* The indicator is always mounted but hidden by default. */}
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
