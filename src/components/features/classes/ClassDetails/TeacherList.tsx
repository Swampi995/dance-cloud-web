import { FC, memo } from "react";

/**
 * Props for the TeacherItem component.
 * @typedef {Object} TeacherItemProps
 * @property {string} name - The name of the teacher.
 */
interface TeacherItemProps {
  name: string;
}

/**
 * A component that displays a single teacher's name.
 *
 * @param {TeacherItemProps} props - The properties for the teacher item.
 * @returns {JSX.Element} The rendered TeacherItem component.
 */
const TeacherItem: FC<TeacherItemProps> = memo(({ name }) => (
  <div>
    <span className="rounded-sm bg-sidebar-accent px-2 py-1 text-sm">
      {name}
    </span>
  </div>
));
TeacherItem.displayName = "TeacherItem";

/**
 * Props for the TeachersList component.
 * @typedef {Object} TeachersListProps
 * @property {string[]} teachers - An array of teacher names.
 */
interface TeachersListProps {
  teachers: string[];
}

/**
 * A component that displays a list of teachers.
 * If no class is selected, it prompts the user to select one.
 *
 * @param {TeachersListProps} props - The properties for the teachers list.
 * @returns {JSX.Element} The rendered TeachersList component.
 */
const TeachersList: FC<TeachersListProps> = memo(({ teachers }) => {
  return (
    <>
      {teachers.map((teacher, index) => (
        <TeacherItem key={`teacher_${index}`} name={teacher} />
      ))}
    </>
  );
});
TeachersList.displayName = "TeachersList";

export { TeachersList };
