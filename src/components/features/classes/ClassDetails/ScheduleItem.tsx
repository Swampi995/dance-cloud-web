import { FC, memo } from "react";

/**
 * Props for the ScheduleItem component.
 * @typedef {Object} ScheduleItemProps
 * @property {string} large - The schedule string for larger screens.
 * @property {string} small - The schedule string for smaller screens.
 */
interface ScheduleItemProps {
  large: string;
  small: string;
}

/**
 * A component that displays a single schedule item.
 * It shows different formats for large and small screens.
 *
 * @param {ScheduleItemProps} props - The properties for the schedule item.
 * @returns {JSX.Element} The rendered ScheduleItem component.
 */
const ScheduleItem: FC<ScheduleItemProps> = memo(({ large, small }) => (
  <div>
    <span className="hidden rounded-sm bg-sidebar-accent px-2 py-1 text-sm lg:inline">
      {large}
    </span>
    <span className="inline rounded-sm bg-sidebar-accent px-2 py-1 text-sm lg:hidden">
      {small}
    </span>
  </div>
));
ScheduleItem.displayName = "ScheduleItem";

/**
 * Props for the ScheduleList component.
 * @typedef {Object} ScheduleListProps
 * @property {{ large: string; small: string }[]} schedules - The list of schedule items.
 */
interface ScheduleListProps {
  schedules: { large: string; small: string }[];
}

/**
 * A component that displays a list of schedule items.
 * If no class is selected, it prompts the user to select one.
 *
 * @param {ScheduleListProps} props - The properties for the schedule list.
 * @returns {JSX.Element} The rendered ScheduleList component.
 */
const ScheduleList: FC<ScheduleListProps> = memo(({ schedules }) => {
  if (schedules.length === 0) {
    return (
      <span className="rounded-sm bg-sidebar-accent px-2 py-1 text-sm">
        No schedule set
      </span>
    );
  }
  return (
    <>
      {schedules.map((sched, index) => (
        <ScheduleItem
          key={`schedule_${index}`}
          large={sched.large}
          small={sched.small}
        />
      ))}
    </>
  );
});
ScheduleList.displayName = "ScheduleList";

export { ScheduleList };
