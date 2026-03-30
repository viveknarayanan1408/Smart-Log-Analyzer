import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export default function AnomaliesTable({ anomalies }) {
  if (!anomalies || anomalies.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-chart-3" />
        <h3 className="text-sm font-semibold text-foreground">Detected Anomalies</h3>
      </div>
      <div className="space-y-2">
        {anomalies.map((a, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground truncate">{a.description}</p>
              {a.timestamp && <p className="text-xs text-muted-foreground font-mono mt-0.5">{a.timestamp}</p>}
            </div>
            <Badge variant="outline" className="ml-3 text-xs capitalize flex-shrink-0">
              {a.severity || a.type}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}