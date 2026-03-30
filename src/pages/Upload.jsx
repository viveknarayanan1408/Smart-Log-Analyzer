import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && (f.name.endsWith(".log") || f.name.endsWith(".txt"))) {
      setFile(f);
    }
  }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setAnalyzing(true);

    setStep("Uploading file...");
    setProgress(10);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    setStep("Extracting log data...");
    setProgress(30);
    const rawText = await file.text();
    const lines = rawText.split("\n").filter(l => l.trim());

    const extracted = await base44.integrations.Core.InvokeLLM({
      prompt: `Parse these log lines into structured JSON. Extract line_number, timestamp, level (INFO/WARN/ERROR/DEBUG), message, and source from each line. Return up to 200 entries.

Log content (first 200 lines):
${lines.slice(0, 200).map((l, i) => `${i + 1}: ${l}`).join("\n")}`,
      response_json_schema: {
        type: "object",
        properties: {
          logs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                line_number: { type: "number" },
                timestamp: { type: "string" },
                level: { type: "string" },
                message: { type: "string" },
                source: { type: "string" }
              }
            }
          }
        }
      }
    });

    const logs = extracted?.logs || [];

    setStep("Analyzing patterns and anomalies...");
    setProgress(55);
    const analysisResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a log analysis engine. Analyze these log entries and provide a structured analysis.

Log entries (${logs.length} total):
${JSON.stringify(logs.slice(0, 200), null, 2)}

Provide analysis as JSON with these fields:
- info_count, warn_count, error_count, debug_count: counts of each level
- top_errors: array of {message, count, first_seen, last_seen} for the most frequent errors
- anomalies: array of {type, description, severity ("critical"/"high"/"medium"/"low"), timestamp}
- slow_operations: array of {operation, duration_ms, timestamp} for slow operations detected
- hourly_distribution: array of {hour, info, warn, error} showing distribution over time periods
- critical_issues: array of {title, description, suggestion, severity} with actionable insights
- time_range_start: earliest timestamp
- time_range_end: latest timestamp`,
      response_json_schema: {
        type: "object",
        properties: {
          info_count: { type: "number" },
          warn_count: { type: "number" },
          error_count: { type: "number" },
          debug_count: { type: "number" },
          top_errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: { type: "string" },
                count: { type: "number" },
                first_seen: { type: "string" },
                last_seen: { type: "string" }
              }
            }
          },
          anomalies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                description: { type: "string" },
                severity: { type: "string" },
                timestamp: { type: "string" }
              }
            }
          },
          slow_operations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                operation: { type: "string" },
                duration_ms: { type: "number" },
                timestamp: { type: "string" }
              }
            }
          },
          hourly_distribution: {
            type: "array",
            items: {
              type: "object",
              properties: {
                hour: { type: "string" },
                info: { type: "number" },
                warn: { type: "number" },
                error: { type: "number" }
              }
            }
          },
          critical_issues: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                suggestion: { type: "string" },
                severity: { type: "string" }
              }
            }
          },
          time_range_start: { type: "string" },
          time_range_end: { type: "string" }
        }
      }
    });

    setStep("Generating AI insights...");
    setProgress(80);
    const aiInsights = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior DevOps engineer analyzing application logs. Based on this analysis data, provide detailed human-readable insights and recommendations.

Analysis: ${JSON.stringify(analysisResult)}
Total parsed logs: ${logs.length}
File name: ${file.name}

Write a comprehensive analysis report in markdown covering:
1. **Summary**: Overview of log health
2. **Key Findings**: Most important patterns
3. **Root Cause Analysis**: What might be causing the errors
4. **Performance Issues**: Any slow operations or bottlenecks
5. **Recommendations**: Specific actionable steps to fix issues
6. **Risk Assessment**: Overall system health rating

Be specific and reference actual error messages and patterns from the data.`,
    });

    setStep("Saving results...");
    setProgress(95);
    const record = await base44.entities.LogAnalysis.create({
      file_name: file.name,
      file_url,
      status: "completed",
      total_lines: lines.length,
      info_count: analysisResult.info_count || 0,
      warn_count: analysisResult.warn_count || 0,
      error_count: analysisResult.error_count || 0,
      debug_count: analysisResult.debug_count || 0,
      time_range_start: analysisResult.time_range_start || "",
      time_range_end: analysisResult.time_range_end || "",
      top_errors: analysisResult.top_errors || [],
      anomalies: analysisResult.anomalies || [],
      slow_operations: analysisResult.slow_operations || [],
      hourly_distribution: analysisResult.hourly_distribution || [],
      critical_issues: analysisResult.critical_issues || [],
      ai_insights: aiInsights,
      parsed_logs: logs.slice(0, 200),
    });

    setProgress(100);
    navigate(`/analysis/${record.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Analyze Logs</h1>
        <p className="text-muted-foreground mt-2">Upload a .log or .txt file for AI-powered analysis</p>
      </div>

      <AnimatePresence mode="wait">
        {!analyzing ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : file
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              }`}
              onClick={() => !file && document.getElementById("file-input").click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".log,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      <X className="w-3.5 h-3.5 mr-1.5" />
                      Remove
                    </Button>
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); analyze(); }} className="bg-primary hover:bg-primary/90">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Analyze Now
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                    <UploadIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">Drop your log file here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse — supports .log and .txt</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/50 p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing Logs</h2>
            <p className="text-sm text-muted-foreground mb-6">{step}</p>
            <div className="max-w-sm mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}