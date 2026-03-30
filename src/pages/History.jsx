import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FileText, ChevronRight, AlertCircle, AlertTriangle, Loader2, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function History() {
  const queryClient = useQueryClient();

  const { data: analyses, isLoading } = useQuery({
    queryKey: ["log-analyses"],
    queryFn: () => base44.entities.LogAnalysis.list("-created_date", 50),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.LogAnalysis.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["log-analyses"] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Analysis History</h1>
          <p className="text-muted-foreground mt-1">View past log analyses</p>
        </div>
        <Link to="/upload">
          <Button className="bg-primary hover:bg-primary/90">New Analysis</Button>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border/50 p-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-1">No analyses yet</h2>
          <p className="text-sm text-muted-foreground mb-6">Upload a log file to get started</p>
          <Link to="/upload">
            <Button className="bg-primary hover:bg-primary/90">Upload Log File</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/analysis/${a.id}`}>
                <div className="bg-card rounded-xl border border-border/50 p-5 hover:border-primary/30 hover:bg-card/80 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{a.file_name}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {a.created_date ? format(new Date(a.created_date), "MMM d, yyyy HH:mm") : "-"}
                          </span>
                          <span>{a.total_lines?.toLocaleString() || 0} lines</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-2">
                        {a.error_count > 0 && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />{a.error_count}
                          </Badge>
                        )}
                        {a.warn_count > 0 && (
                          <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />{a.warn_count}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {a.status || "completed"}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteMutation.mutate(a.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}