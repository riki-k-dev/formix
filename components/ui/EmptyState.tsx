import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "p-8 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10 flex flex-col items-center justify-center min-h-[200px]",
        className,
      )}
    >
      <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mb-4">
        <Icon size={20} className="text-neutral-500" />
      </div>
      {title && (
        <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      )}
      <p className="text-sm text-neutral-500 max-w-sm mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
