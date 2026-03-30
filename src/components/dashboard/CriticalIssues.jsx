import { AlertTriangle, AlertCircle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  high: { icon: AlertTriangle, color: "text-chart-3", bg: "bg-chart-3/10", border: "border-chart-3/20" },
  medium: { icon: Info, color: "text-chart-5", bg: "bg-chart-5/10", border: "border-chart-5/20" },
  low: { icon: Info, color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
};

export default function CriticalIssues({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Critical Issues</h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Lightbulb className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No critical issues found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Critical Issues ({issues.length})</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {issues.map((issue, i) => {
          const config = severityConfig[issue.severity] || severityConfig.low;
          const Icon = config.icon;
          return (
            <div key={i} className={cn("rounded-lg border p-4", config.bg, config.border)}>
              <div className="flex items-start gap-3">
                <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color)} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{issue.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                  {issue.suggestion && (
                    <div className="flex items-start gap-1.5 mt-2">
                      <Lightbulb className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                      <p className="text-xs text-primary">{issue.suggestion}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}