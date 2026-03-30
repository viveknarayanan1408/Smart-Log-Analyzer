import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FileText, AlertCircle, AlertTriangle, Info, Upload, ArrowRight, Loader2, Terminal, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ["log-analyses-dashboard"],
    queryFn: () => base44.entities.LogAnalysis.list("-created_date", 20),
    initialData: [],
  });

  const totals = analyses.reduce(
    (acc, a) => ({
      files: acc.files + 1,
      lines: acc.lines + (a.total_lines || 0),
      errors: acc.errors + (a.error_count || 0),
      warnings: acc.warnings + (a.warn_count || 0),
    }),
    { files: 0, lines: 0, errors: 0, warnings: 0 }
  );

  const chartData = analyses.slice(0, 10).reverse().map(a => ({
    name: a.file_name?.length > 12 ? a.file_name.slice(0, 12) + "…" : a.file_name,
    errors: a.error_count || 0,
    warnings: a.warn_count || 0,
    info: a.info_count || 0,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of all log analyses</p>
        </div>
        <Link to="/upload">
          <Button className="bg-primary hover:bg-primary/90">
            <Upload className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-20 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Terminal className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Smart Log Analyzer</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Upload your application log files and get AI-powered analysis with error detection, 
            pattern recognition, and actionable insights.
          </p>
          <Link to="/upload">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Log File
            </Button>
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Files Analyzed" value={totals.files} icon={FileText} color="text-foreground" subtitle="Total analyses" />
            <StatCard title="Total Lines" value={totals.lines.toLocaleString()} icon={BarChart3} color="text-primary" subtitle="Lines processed" />
            <StatCard title="Errors Found" value={totals.errors.toLocaleString()} icon={AlertCircle} color="text-destructive" subtitle="Across all files" />
            <StatCard title="Warnings" value={totals.warnings.toLocaleString()} icon={AlertTriangle} color="text-chart-3" subtitle="Across all files" />
          </div>

          {chartData.length > 0 && (
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Log Levels by File</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="errors" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} name="Errors" />
                  <Bar dataKey="warnings" fill="hsl(35, 90%, 55%)" radius={[4, 4, 0, 0]} name="Warnings" />
                  <Bar dataKey="info" fill="hsl(175, 70%, 45%)" radius={[4, 4, 0, 0]} name="Info" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Analyses</h3>
              <Link to="/history" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {analyses.slice(0, 5).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/analysis/${a.id}`}>
                    <div className="bg-card rounded-xl border border-border/50 p-4 hover:border-primary/30 transition-all duration-200 flex items-center justify-between group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{a.file_name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {a.created_date ? format(new Date(a.created_date), "MMM d, HH:mm") : ""}
                            </span>
                            <span>{a.total_lines || 0} lines</span>
                            {a.error_count > 0 && (
                              <span className="text-destructive">{a.error_count} errors</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}