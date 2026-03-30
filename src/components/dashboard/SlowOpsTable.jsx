import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SlowOpsTable({ operations }) {
  if (!operations || operations.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Slow Operations</h3>
      </div>
      <div className="space-y-2">
        {operations.map((op, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground truncate font-mono">{op.operation}</p>
              {op.timestamp && <p className="text-xs text-muted-foreground font-mono mt-0.5">{op.timestamp}</p>}
            </div>
            <span className={cn(
              "text-xs font-mono font-semibold ml-3 flex-shrink-0",
              op.duration_ms > 5000 ? "text-destructive" : op.duration_ms > 2000 ? "text-chart-3" : "text-muted-foreground"
            )}>
              {op.duration_ms}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}