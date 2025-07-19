import { FC, memo, useMemo } from "react";
import { Header } from "./Header";
import { useClubs } from "@/hooks/use-clubs";
import { useClubEvents } from "@/hooks/use-club-events";
import EventCard from "./EventCard";
import AddEventCard from "./AddEventCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Component for displaying a grid of upcoming events for the selected club.
 * Shows a loading skeleton while events are loading.
 *
 * - Renders an AddEventCard for creating new events.
 * - Uses EventCard to display each event.
 * - Relies on useClubs and useClubEvents hooks for data.
 *
 * @component
 */
const UpcomingEvents: FC = () => {
  // Get the currently selected club from the context/hook
  const { selectedClub } = useClubs();

  /**
   * Memoized calculation of today's date at midnight (00:00:00).
   * Used as the lower bound for fetching events starting from today.
   */
  const startOfToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /**
   * Fetch club events starting from today for the selected club.
   */
  const { data: eventData, loading } = useClubEvents(
    selectedClub?.id ?? "",
    startOfToday,
  );

  /**
   * Handler for editing an event.
   * @param {string} eventId - The ID of the event to edit.
   */
  const handleEdit = (eventId: string) => {
    // Placeholder: Replace with real navigation or modal open in the future.
    console.log(eventId);
  };

  /**
   * Handler for adding a new event.
   */
  const handleAddEvent = () => {
    // Placeholder: Replace with real logic for event creation.
  };

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
          // Show AddEventCard and list of EventCards when data is loaded
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18rem,1fr))]">
            <AddEventCard onAdd={handleAddEvent} />
            {eventData.map((event) => (
              <EventCard
                key={event.id}
                image={event.backgroundURL ?? ""}
                title={event.name}
                location={event.address}
                startDate={event.startDate.toDate()}
                endDate={event.endDate.toDate()}
                onEdit={() => handleEdit(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

UpcomingEvents.displayName = "UpcomingEvents";

export default memo(UpcomingEvents);
