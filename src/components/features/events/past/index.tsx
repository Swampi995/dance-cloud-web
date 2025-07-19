// PastEvents.tsx
import { FC, memo, useMemo } from "react";
import { Header } from "./Header";
import { useClubs } from "@/hooks/use-clubs";
import { useClubEvents } from "@/hooks/use-club-events";
import PastEventCard from "./PastEventCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Component for displaying a grid of past events for the selected club.
 * Shows a loading skeleton while events are loading.
 *
 * - Uses PastEventCard to display each event.
 * - Relies on useClubs and useClubEvents hooks for data.
 *
 * @component
 */
const PastEvents: FC = () => {
  // Get the currently selected club from the context/hook
  const { selectedClub } = useClubs();

  /**
   * Memoized calculation of today's date at midnight (00:00:00).
   * Used as the upper bound for fetching past events ending before today.
   */
  const startOfToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /**
   * Fetch all club events those that have already ended.
   */
  const { data: eventData, loading } = useClubEvents(
    selectedClub?.id ?? "",
    undefined,
    startOfToday,
  );

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden px-4 sm:px-10">
      {/* Section header */}
      <Header />

      {/* Grid container for event cards and skeletons */}
      <div className="flex-1 p-4">
        {loading ? (
          // Show skeleton cards while loading
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18rem,1fr))]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          // List of PastEventCards when data is loaded
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18rem,1fr))]">
            {eventData.map((event) => (
              <PastEventCard
                key={event.id}
                image={event.backgroundURL ?? ""}
                title={event.name}
                location={event.address}
                startDate={event.startDate.toDate()}
                endDate={event.endDate.toDate()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

PastEvents.displayName = "PastEvents";

export default memo(PastEvents);
