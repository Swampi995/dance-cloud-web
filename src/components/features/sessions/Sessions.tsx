import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheck, CircleDashed, CircleX, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useClubs } from "@/hooks/use-clubs";
import { useClubSessions } from "@/hooks/use-club-sessions";
import {
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useState } from "react";
import { useDynamicPageSize } from "@/hooks/use-dynamic-page-size";
import { Skeleton } from "@/components/ui/skeleton";

const Sessions = () => {
  const { selectedClub } = useClubs();

  // Keep track of current page and a list of startAfterDoc snapshots for each page
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [startAfterDocs, setStartAfterDocs] = useState<
    (QueryDocumentSnapshot<DocumentData> | null)[]
  >([null]);

  const dynamicPageSize = useDynamicPageSize();

  // Pass the current page’s startAfterDoc to the hook
  const { data, error, loading } = useClubSessions(
    selectedClub?.id ?? "",
    dynamicPageSize,
    startAfterDocs[currentPage],
  );

  // Early return if no club is selected
  if (!selectedClub) {
    return (
      <div className="w-full place-self-center p-4 text-center text-4xl font-semibold">
        No club selected.
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full place-self-center p-4 text-center text-4xl font-semibold text-red-500">
        Error: {error.message}
      </div>
    );
  }

  // If we have no data or the sessions array is empty, show a fallback
  if (!loading && (!data || data.sessions.length === 0)) {
    return (
      <div className="w-full place-self-center p-4 text-center text-4xl font-semibold">
        No sessions found.
      </div>
    );
  }

  // Determine if we can go to the next/previous page
  // A common check for "has next page" is whether you received a full `PAGE_SIZE` of docs
  const canGoNext =
    data.sessions.length === dynamicPageSize && data.lastVisible !== null;
  const canGoPrev = currentPage > 0;

  const handleNext = () => {
    if (canGoNext && data.lastVisible) {
      // Store the new lastVisible doc so we can jump back to it later
      setStartAfterDocs((prev) => {
        const docs = [...prev];
        docs[currentPage + 1] = data.lastVisible;
        return docs;
      });
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/2">Member Name</TableHead>
        <TableHead className="w-1/5 text-center">Check-In Time</TableHead>
        <TableHead className="w-1/5 text-center">Expiry Date</TableHead>
        <TableHead className="w-[10%] text-center">Active</TableHead>
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-4 sm:px-10">
      <div className="mt-6 flex justify-between">
        <div className="flex place-items-center">
          <SidebarTrigger />
          <h1 className="pl-4 text-lg font-bold sm:text-2xl lg:text-4xl">
            Session Check-ins
          </h1>
        </div>
        <DatePicker />
      </div>

      <div className="flex-1 space-y-4 rounded-xl bg-sidebar/70 p-1 py-4 sm:px-4">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Search width={16} className="text-muted-foreground" />
          </div>
          <Input
            className="max-w-xs pl-8 ring-1 ring-inset ring-sidebar-accent"
            placeholder="Search by name"
          />
        </div>

        {loading ? (
          <Table>
            {renderTableHeader()}
            <TableBody>
              {Array.from({ length: dynamicPageSize }).map((_, i) => (
                <TableRow key={i}>
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
          <>
            {/* Sessions table */}
            <Table>
              {renderTableHeader()}
              <TableBody>
                {data.sessions.map((session) => {
                  // Convert Firestore timestamps to JS Dates
                  const checkInTime = (session.date as Timestamp).toDate();
                  const expiration = session.userMembershipData?.expiration
                    ? (
                        session.userMembershipData.expiration as Timestamp
                      ).toDate()
                    : null;

                  // Determine if the membership is active (expiration date is in the future)
                  const isActive = expiration ? expiration > new Date() : null;

                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.userData?.name ?? "Unknown User"}
                      </TableCell>
                      <TableCell className="text-center">
                        {checkInTime.toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {expiration
                          ? expiration.toLocaleDateString()
                          : "No membership"}
                      </TableCell>
                      <TableCell className="place-items-center">
                        {isActive === null ? ( // TODO: Ugly double ternary, should make it prettier
                          <CircleDashed className="text-muted-foreground" />
                        ) : isActive ? (
                          <CircleCheck className="text-green-500" />
                        ) : (
                          <CircleX className="text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination controls */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={`hover:bg-sidebar ${!canGoPrev && "text-muted-foreground"}`}
                    onClick={handlePrevious}
                    isActive={!canGoPrev}
                    href="#"
                  />
                </PaginationItem>

                {/* Current Page Display (1-based) */}
                <PaginationItem>
                  <PaginationLink className="hover:bg-sidebar" href="#">
                    Page {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    className={`hover:bg-sidebar ${!canGoNext && "text-muted-foreground"}`}
                    onClick={handleNext}
                    isActive={!canGoNext}
                    href="#"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
};

Sessions.displayName = "Sessions";
export default Sessions;
