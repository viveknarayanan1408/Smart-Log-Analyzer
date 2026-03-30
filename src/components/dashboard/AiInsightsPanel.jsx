import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";

export default function AiInsightsPanel({ insights }) {
  if (!insights) return null;

  return (
    <div className="bg-card rounded-xl border border-primary/20 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
      </div>
      <div className="prose prose-sm prose-invert max-w-none text-sm text-muted-foreground leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="my-2 text-muted-foreground leading-relaxed">{children}</p>,
            strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
            ul: ({ children }) => <ul className="my-2 ml-4 list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="my-2 ml-4 list-decimal">{children}</ol>,
            li: ({ children }) => <li className="my-1 text-muted-foreground">{children}</li>,
            h1: ({ children }) => <h1 className="text-base font-semibold text-foreground mt-4 mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-sm font-semibold text-foreground mt-3 mb-1">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">{children}</h3>,
            code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-xs">{children}</code>,
          }}
        >
          {insights}
        </ReactMarkdown>
      </div>
    </div>
  );
}