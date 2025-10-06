type Status = "ok" | "warn" | "info";

type Props = {
  title: string;
  status: Status;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const statusToBorder: Record<Status, string> = {
  ok: "border-green-500",
  warn: "border-amber-500",
  info: "border-gray-400",
};

export default function StatusCard({ title, status, children, footer }: Props) {
  const borderClass = statusToBorder[status];
  return (
    <div className={`rounded-lg border ${borderClass} p-4 bg-white/50 dark:bg-zinc-900/40`}>
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-200">{children}</div>
      {footer ? (
        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
