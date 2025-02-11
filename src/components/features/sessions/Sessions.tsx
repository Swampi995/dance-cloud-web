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
import { CircleCheck, CircleX, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Sessions = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-4 sm:px-10">
      <div className="mt-6 flex justify-between">
        <div className="flex place-items-center">
          <SidebarTrigger />
          <h1 className="pl-4 text-xl font-bold sm:text-4xl">
            Session Check-ins
          </h1>
        </div>
        <DatePicker />
      </div>
      <div className="min-h-[100vh] flex-1 space-y-4 rounded-xl bg-sidebar/70 p-1 py-4 sm:px-4 md:min-h-min">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Search width={16} className="text-muted-foreground" />
          </div>
          <Input
            className="max-w-xs pl-8 ring-1 ring-inset ring-sidebar-accent"
            placeholder="Search by name"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Name</TableHead>
              <TableHead>Check-In Time</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Alex Johnson</TableCell>
              <TableCell>5:55 PM</TableCell>
              <TableCell>4 Mar 2025</TableCell>
              <TableCell className="place-items-end">
                <CircleCheck className="text-green-500" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Maria Gonzalez</TableCell>
              <TableCell>5:58 PM</TableCell>
              <TableCell>4 Mar 2025</TableCell>
              <TableCell className="place-items-end">
                <CircleX className="text-red-500" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="hover:bg-sidebar" href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className="hover:bg-sidebar" href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className="hover:bg-sidebar" href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className="hover:bg-sidebar" href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext className="hover:bg-sidebar" href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

Sessions.displayName = "Sessions";
export default Sessions;
