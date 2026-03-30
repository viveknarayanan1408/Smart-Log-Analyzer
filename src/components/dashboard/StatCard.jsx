import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-5 hover:border-border transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={cn("text-3xl font-bold tracking-tight", color || "text-foreground")}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          color?.includes("primary") ? "bg-primary/10" : 
          color?.includes("destructive") ? "bg-destructive/10" :
          color?.includes("accent") ? "bg-accent/10" :
          "bg-muted"
        )}>
          <Icon className={cn("w-5 h-5", color || "text-muted-foreground")} />
        </div>
      </div>
    </div>
  );
}