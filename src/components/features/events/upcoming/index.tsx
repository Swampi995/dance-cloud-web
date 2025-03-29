// UpcomingEvents.tsx
import { FC, memo, useMemo } from "react";
import { Header } from "./Header";
import { useClubs } from "@/hooks/use-clubs";
import { useClubEvents } from "@/hooks/use-club-events";
import { MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

function renderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[30%] text-xs sm:text-base">Name</TableHead>
        <TableHead className="w-[25%] text-center text-xs sm:text-base">
          Address
        </TableHead>
        <TableHead className="w-[20%] text-center text-xs sm:text-base">
          Start Date
        </TableHead>
        <TableHead className="w-[20%] text-center text-xs sm:text-base">
          End Date
        </TableHead>
        <TableHead className="w-[5%] text-center text-xs sm:text-base"></TableHead>
      </TableRow>
    </TableHeader>
  );
}

const UpcomingEvents: FC = () => {
  const { selectedClub } = useClubs();
  const { data: eventData, loading } = useClubEvents(selectedClub?.id ?? "");

  // Filter future events using useMemo for performance
  const futureEvents = useMemo(() => {
    return (
      eventData?.filter((event) => event.startDate.toDate() > new Date()) || []
    );
  }, [eventData]);

  const handleEdit = (eventId: string) => {
    // Implement your edit event logic here
    console.log("Edit event:", eventId);
  };

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden px-4 sm:px-10">
      <Header />
      <div className="flex-1 space-y-4 rounded-xl bg-sidebar/70 sm:px-2">
        {loading ? (
          <Table>
            {renderTableHeader()}
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-row-${i}`}>
                  <TableCell>
                    <Skeleton className="h-[24px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[24px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[24px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-[24px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-[24px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            {renderTableHeader()}
            <TableBody>
              {futureEvents.map((event) => (
                <TableRow key={event.id} className="">
                  <TableCell className="text-xs font-medium sm:text-base">
                    {event.name}
                  </TableCell>
                  <TableCell className="text-center text-xs sm:text-base">
                    {event.address}
                  </TableCell>
                  <TableCell className="text-center text-xs sm:text-base">
                    {format(event.startDate.toDate(), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-center text-xs sm:text-base">
                    {format(event.endDate.toDate(), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="align-middle">
                          <span className="sr-only">Open options</span>
                          <MoreHorizontal size={16} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-neutral-900">
                        <button
                          onClick={() => handleEdit(event.id)}
                          className="rounded-md px-2 py-1 text-center text-sm hover:bg-purple-900/30 focus:outline-none focus:ring-0 focus:ring-transparent sm:text-base"
                        >
                          Edit
                        </button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

UpcomingEvents.displayName = "UpcomingEvents";

export default memo(UpcomingEvents);
