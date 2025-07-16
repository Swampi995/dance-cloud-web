import { FC, memo, useMemo } from "react";
import { Header } from "./Header";
import { useClubs } from "@/hooks/use-clubs";
import { useClubEvents } from "@/hooks/use-club-events";
import EventCard from "./EventCard";
import AddEventCard from "./AddEventCard";
import { Skeleton } from "@/components/ui/skeleton";

const UpcomingEvents: FC = () => {
  const { selectedClub } = useClubs();
  const { data: eventData, loading } = useClubEvents(selectedClub?.id ?? "");
  console.log(eventData);
  const futureEvents = useMemo(() => {
    return (
      eventData
        ?.filter((event) => event.startDate.toDate() > new Date())
        .sort(
          (a, b) =>
            b.startDate.toDate().getTime() - a.startDate.toDate().getTime(),
        ) || []
    );
  }, [eventData]);

  const handleEdit = (eventId: string) => {
    // 👉 hook this up to your edit flow / router
    console.log("Edit event:", eventId);
  };

  const handleAddEvent = () => {
    // 👉 route to “create event” page, open modal, etc.
    console.log("Create new event");
  };

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden px-4 sm:px-10">
      <Header />

      {/* Grid container */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18rem,1fr))]">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(18rem,1fr))]">
            <AddEventCard onAdd={handleAddEvent} />
            {eventData.map(
              // DEBUG: Replace with `futureEvents`
              (event) => (
                <EventCard
                  key={event.id}
                  image={
                    event.backgroundURL ?? "" /* TODO: adjust field name */
                  }
                  title={event.name}
                  location={event.address}
                  startDate={event.startDate.toDate()}
                  endDate={event.endDate.toDate()}
                  onEdit={() => handleEdit(event.id)}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

UpcomingEvents.displayName = "UpcomingEvents";

export default memo(UpcomingEvents);
