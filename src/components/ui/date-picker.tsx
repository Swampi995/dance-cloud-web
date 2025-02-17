import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePicker {
  className?: string;
  value: Date | undefined;
  onChange: (newValue: Date | undefined) => void;
}

const DatePicker = ({ className, value, onChange }: DatePicker) => {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left text-xs font-normal sm:text-sm",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="sm:mr-2" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            selected={value}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

DatePicker.displayName = "DatePicker";

export { DatePicker };
