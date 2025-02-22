import { FC, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";

const months = [
  { name: "January", value: 0 },
  { name: "February", value: 1 },
  { name: "March", value: 2 },
  { name: "April", value: 3 },
  { name: "May", value: 4 },
  { name: "June", value: 5 },
  { name: "July", value: 6 },
  { name: "August", value: 7 },
  { name: "September", value: 8 },
  { name: "October", value: 9 },
  { name: "November", value: 10 },
  { name: "December", value: 11 },
];

export interface MonthPickerProps {
  value: number;
  onChange: (month: number) => void;
  width: number;
}

const MonthPicker: FC<MonthPickerProps> = memo(({ value, onChange, width }) => {
  const handleMonthSelect = useCallback(
    (monthIndex: number) => {
      onChange(monthIndex);
    },
    [onChange],
  );

  const monthButtons = useMemo(() => {
    return months.map((month, index) => (
      <Button
        key={month.value}
        variant={value === index ? "default" : "outline"}
        onClick={() => handleMonthSelect(index)}
      >
        {month.name.substring(0, 3)}
      </Button>
    ));
  }, [value, handleMonthSelect]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={`w-[${width}px] flex items-center justify-center gap-2`}
          variant="outline"
        >
          <Calendar />
          {months[value].name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-3 gap-2 p-4">
        {monthButtons}
      </PopoverContent>
    </Popover>
  );
});

MonthPicker.displayName = "MonthPicker";

export { MonthPicker };
