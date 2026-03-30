import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const levelColors = {
  ERROR: "bg-destructive/15 text-destructive border-destructive/30",
  WARN: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  INFO: "bg-primary/15 text-primary border-primary/30",
  DEBUG: "bg-muted text-muted-foreground border-border",
};

export default function LogTable({ logs }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  if (!logs || logs.length === 0) return null;

  const filtered = logs.filter(log => {
    const matchSearch = !search || log.message?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "all" || log.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-sm font-semibold text-foreground">Parsed Log Entries ({filtered.length})</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs w-48"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="WARN">Warn</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="DEBUG">Debug</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">#</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Timestamp</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Level</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Source</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((log, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                <td className="py-2 px-3 font-mono text-muted-foreground">{log.line_number || i + 1}</td>
                <td className="py-2 px-3 font-mono text-muted-foreground whitespace-nowrap">{log.timestamp || "-"}</td>
                <td className="py-2 px-3">
                  <Badge variant="outline" className={cn("text-xs font-mono", levelColors[log.level] || levelColors.INFO)}>
                    {log.level}
                  </Badge>
                </td>
                <td className="py-2 px-3 text-muted-foreground font-mono">{log.source || "-"}</td>
                <td className="py-2 px-3 text-foreground font-mono max-w-md truncate">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}