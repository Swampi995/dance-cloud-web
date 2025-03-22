import { useState, FC } from "react";
import {
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CircleCheck, CircleDashed, CircleX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubs } from "@/hooks/use-clubs";
import { useClubSessions } from "@/hooks/use-club-sessions";
import { useDynamicPageSize } from "@/hooks/use-dynamic-page-size";
import { useToast } from "@/hooks/use-toast";

/**
 * Renders the table header for the sessions table.
 *
 * @returns {JSX.Element} The table header JSX element.
 */
function renderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[40%] text-xs sm:text-base">
          Member Name
        </TableHead>
        <TableHead className="w-[25%] text-center text-xs sm:text-base">
          Check-In
        </TableHead>
        <TableHead className="w-[10%] text-center text-xs sm:text-base">
          Expiry
        </TableHead>
        <TableHead className="w-[20%] text-center text-xs sm:text-base">
          Type
        </TableHead>
        <TableHead className="w-[5%] text-center text-xs sm:text-base">
          Active
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

/**
 * Sessions component displays a paginated table of club session check-ins.
 *
 * This component renders:
 * - A header containing a sidebar trigger, title, and a date range picker.
 * - A table displaying session details such as member name, check-in time,
 *   membership expiry date, membership type, and active status.
 * - Pagination controls to navigate between pages.
 *
 * The session data is fetched from Firestore using custom hooks. The data is
 * filtered by a selected date range and supports pagination.
 *
 * @component
 */
const Sessions: FC = () => {
  // Retrieve the currently selected club from context.
  const { selectedClub } = useClubs();

  /**
   * Pagination state:
   * - currentPage: index of the current page.
   * - startAfterDocs: array of document snapshots used for Firestore pagination.
   */
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [startAfterDocs, setStartAfterDocs] = useState<
    (QueryDocumentSnapshot<DocumentData> | null)[]
  >([null]);

  // Get dynamic page size (number of sessions per page) from a custom hook.
  const dynamicPageSize = useDynamicPageSize();

  const { toast } = useToast();

  /**
   * Date range state for filtering session check-ins.
   * Default is from 7 days ago to today.
   */
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data, error, loading } = useClubSessions(
    selectedClub?.id ?? "",
    dynamicPageSize,
    startAfterDocs[currentPage],
    date,
    date,
  );

  // Error handling: if an error occurs during data fetching, display an error toast.
  if (error) {
    toast({
      description: "An error occurred. Please try again",
      variant: "destructive",
    });
  }

  /**
   * Determine if there are more pages to navigate.
   *
   * - canGoNext: true if the number of fetched sessions equals the page size and a lastVisible doc exists.
   * - canGoPrev: true if the current page index is greater than zero.
   */
  const canGoNext =
    data?.sessions.length === dynamicPageSize && data.lastVisible !== null;
  const canGoPrev = currentPage > 0;

  /**
   * Handles pagination to the next page.
   * Updates the pagination state by storing the last visible document snapshot.
   */
  const handleNext = () => {
    if (canGoNext && data.lastVisible) {
      setStartAfterDocs((prev) => {
        const docs = [...prev];
        docs[currentPage + 1] = data.lastVisible;
        return docs;
      });
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Handles pagination to the previous page.
   * Simply decrements the current page index.
   */
  const handlePrevious = () => {
    if (canGoPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-4 sm:px-10">
      {/* Header section: sidebar trigger, page title, and date range picker */}
      <div className="mt-6 flex items-center justify-between space-x-2">
        <div className="flex items-center">
          <SidebarTrigger />
          <h1 className="pl-4 text-sm font-bold sm:text-xl md:text-2xl lg:text-4xl">
            Session Check-ins
          </h1>
        </div>
        <DatePicker value={date} onChange={setDate} />
      </div>

      {/* Main content area: table of sessions and pagination controls */}
      <div className="flex-1 space-y-4 rounded-xl bg-sidebar/70 p-1 py-4 sm:px-4">
        {loading ? (
          // Display a loading skeleton while session data is being fetched.
          <Table>
            {renderTableHeader()}
            <TableBody>
              {Array.from({ length: dynamicPageSize }).map((_, i) => (
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
          <>
            {/* Sessions Table: Displays session details */}
            <Table>
              {renderTableHeader()}
              <TableBody>
                {data?.sessions.map((session) => {
                  // Convert Firestore Timestamps to JavaScript Date objects.
                  const checkInTime = (session.date as Timestamp).toDate();
                  const expiration = session.userMembershipData?.expiration
                    ? (
                        session.userMembershipData.expiration as Timestamp
                      ).toDate()
                    : null;

                  const membershipName =
                    session.clubMembershipData?.name?.replace(
                      "Abonament",
                      "",
                    ) ?? "—";

                  // Determine if the membership is active based on the expiration date.
                  const isActive = expiration ? expiration > new Date() : null;

                  return (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.userData?.name ?? "Unknown User"}
                      </TableCell>
                      <TableCell className="text-center">
                        {format(checkInTime, "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-center">
                        {expiration ? expiration.toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell
                        className={`text-center ${membershipName.includes("7Card") && "text-orange-300"}`}
                      >
                        {membershipName}
                      </TableCell>
                      <TableCell className="items-center text-center">
                        {isActive === null ? (
                          <CircleDashed className="mx-auto text-muted-foreground" />
                        ) : isActive ? (
                          <CircleCheck className="mx-auto text-green-500" />
                        ) : (
                          <CircleX className="mx-auto text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={`text-xs hover:bg-sidebar sm:text-base ${
                      !canGoPrev && "text-muted-foreground"
                    } cursor-pointer`}
                    onClick={handlePrevious}
                    isActive={!canGoPrev}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink className="text-xs hover:bg-transparent sm:text-base">
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={`text-xs hover:bg-sidebar sm:text-base ${
                      !canGoNext && "text-muted-foreground"
                    } cursor-pointer`}
                    onClick={handleNext}
                    isActive={!canGoNext}
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
