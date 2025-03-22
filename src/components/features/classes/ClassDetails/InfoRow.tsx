import { FC, memo } from "react";

/**
 * Props for the InfoRow component.
 * @typedef {Object} InfoRowProps
 * @property {string} label - The label for the information.
 * @property {string} value - The corresponding value.
 */
interface InfoRowProps {
  label: string;
  value: string;
}

/**
 * A component that displays a label and a value in a row.
 *
 * @param {InfoRowProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered InfoRow component.
 */
const InfoRow: FC<InfoRowProps> = memo(({ label, value }) => (
  <div className="flex place-items-center justify-between space-x-10">
    <p className="text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
));
InfoRow.displayName = "InfoRow";

export { InfoRow };
