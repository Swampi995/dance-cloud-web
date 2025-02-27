import { FC, memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClubClassType } from "@/schemas/classes";
import { ClubType } from "@/schemas/club";
import { useClubTeachers } from "@/hooks/use-club-teachers";

interface ClassDetailsProps {
  clubClass: ClubClassType | null;
  club: ClubType | null;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: FC<InfoRowProps> = memo(({ label, value }) => (
  <div className="flex place-items-center justify-between space-x-10">
    <p className="text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
));

interface ScheduleItemProps {
  large: string;
  small: string;
}

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

interface ScheduleListProps {
  schedules: { large: string; small: string }[];
  isClassSelected: boolean;
}

const ScheduleList: FC<ScheduleListProps> = memo(
  ({ schedules, isClassSelected }) => {
    if (!isClassSelected) {
      return <span>Select a class</span>;
    }
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
  },
);

interface TeacherItemProps {
  name: string;
}

const TeacherItem: FC<TeacherItemProps> = memo(({ name }) => (
  <div>
    <span className="rounded-sm bg-sidebar-accent px-2 py-1 text-sm">
      {name}
    </span>
  </div>
));

interface TeachersListProps {
  teachers: string[];
  isClassSelected: boolean;
}

const TeachersList: FC<TeachersListProps> = memo(
  ({ teachers, isClassSelected }) => {
    if (!isClassSelected) {
      return <span>Select a class</span>;
    }
    return (
      <>
        {teachers.map((teacher, index) => (
          <TeacherItem key={`teacher_${index}`} name={teacher} />
        ))}
      </>
    );
  },
);

const ClassDetails: FC<ClassDetailsProps> = memo(({ club, clubClass }) => {
  const { data: teachersData } = useClubTeachers(
    club?.id ?? "",
    clubClass?.id ?? "",
  );

  const formattedSchedules = useMemo(() => {
    if (!clubClass?.schedule?.length) return [];

    // Sort schedules by day and format each entry
    const sorted = [...clubClass.schedule].sort((a, b) => a.day - b.day);
    return sorted.map((sched) => {
      const formattedHour = sched.hour.toString().padStart(2, "0");
      const formattedMinute = sched.minute.toString().padStart(2, "0");
      const dayName = daysOfWeek[sched.day];

      return {
        large: `${dayName} ${formattedHour}:${formattedMinute}`,
        small: `${dayName.slice(0, 3)} ${formattedHour}:${formattedMinute}`,
      };
    });
  }, [clubClass?.schedule]);

  const sortedTeacherNames = useMemo(() => {
    const names = teachersData
      .filter((t) => t?.userData?.name)
      .map((t) => t.userData!.name)
      .sort((a, b) => a.localeCompare(b));

    return names.length ? names : ["No teachers assigned"];
  }, [teachersData]);

  const isClassSelected = !!clubClass;

  return (
    <Card className="max-w-4xl rounded-3xl bg-sidebar/40">
      <CardHeader>
        <CardTitle className="text-sm font-light">Class Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <InfoRow label="Name" value={clubClass?.name ?? "Select a class"} />
        <InfoRow label="Level" value={clubClass?.level ?? "Select a class"} />

        <div className="flex place-items-center justify-between space-x-10">
          <p className="text-sm">Schedule</p>
          <div className="flex flex-wrap gap-1 font-medium md:gap-2 lg:gap-4">
            <ScheduleList
              schedules={formattedSchedules}
              isClassSelected={isClassSelected}
            />
          </div>
        </div>

        <div className="flex place-items-center justify-between space-x-10">
          <p className="text-sm">Teachers</p>
          <div className="flex flex-wrap gap-1 font-medium md:gap-2 lg:gap-4">
            <TeachersList
              teachers={sortedTeacherNames}
              isClassSelected={isClassSelected}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ClassDetails.displayName = "ClassDetails";

export { ClassDetails };
