type Props = {
  value: string;
  onChange: (v: string) => void;
};

// Valid SWS sites (example subset); ensure we default to a valid station
const OPTIONS = [
  "Hobart",
  "Canberra",
  "Learmonth",
  "Darwin",
  "Mawson",
  "Macquarie Island",
] as const;

export default function SiteSelector({ value, onChange }: Props) {
  return (
    <select
      className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
