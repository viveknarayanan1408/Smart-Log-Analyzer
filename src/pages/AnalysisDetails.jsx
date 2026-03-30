import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { FileText, ArrowLeft, Download, Clock, AlertCircle, AlertTriangle, Info, Bug, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import LogLevelChart from "@/components/dashboard/LogLevelChart";
import ErrorPieChart from "@/components/dashboard/ErrorPieChart";
import CriticalIssues from "@/components/dashboard/CriticalIssues";
import AnomaliesTable from "@/components/dashboard/AnomaliesTable";
import SlowOpsTable from "@/components/dashboard/SlowOpsTable";
import AiInsightsPanel from "@/components/dashboard/AiInsightsPanel";
import LogTable from "@/components/dashboard/LogTable";
import { format } from "date-fns";

export default function AnalysisDetail() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const items = await base44.entities.LogAnalysis.filter({ id });
      if (items.length > 0) setAnalysis(items[0]);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Analysis not found</p>
        <Link to="/history">
          <Button variant="outline" className="mt-4">Back to History</Button>
        </Link>
      </div>
    );
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${analysis.file_name}-analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link to="/history">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground tracking-tight">{analysis.file_name}</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Analyzed {analysis.created_date ? format(new Date(analysis.created_date), "PPp") : ""}
              {analysis.time_range_start && ` · Log range: ${analysis.time_range_start} → ${analysis.time_range_end}`}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={exportJson}>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export JSON
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Lines" value={analysis.total_lines?.toLocaleString() || 0} icon={FileText} color="text-foreground" />
        <StatCard title="Errors" value={analysis.error_count?.toLocaleString() || 0} icon={AlertCircle} color="text-destructive" />
        <StatCard title="Warnings" value={analysis.warn_count?.toLocaleString() || 0} icon={AlertTriangle} color="text-chart-3" />
        <StatCard title="Info" value={analysis.info_count?.toLocaleString() || 0} icon={Info} color="text-primary" />
      </div>

      <AiInsightsPanel insights={analysis.ai_insights} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LogLevelChart data={analysis.hourly_distribution} />
        </div>
        <ErrorPieChart data={analysis.top_errors} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CriticalIssues issues={analysis.critical_issues} />
        <div className="space-y-6">
          <AnomaliesTable anomalies={analysis.anomalies} />
          <SlowOpsTable operations={analysis.slow_operations} />
        </div>
      </div>

      <LogTable logs={analysis.parsed_logs} />
    </div>
  );
}