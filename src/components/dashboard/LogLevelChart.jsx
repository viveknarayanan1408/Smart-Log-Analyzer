import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
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

export default function LogLevelChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Log Distribution Over Time</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No distribution data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Log Distribution Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="gradInfo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(175, 70%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(175, 70%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradWarn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(35, 90%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(35, 90%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradError" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 18%)" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="info" stroke="hsl(175, 70%, 45%)" fill="url(#gradInfo)" strokeWidth={2} name="Info" />
          <Area type="monotone" dataKey="warn" stroke="hsl(35, 90%, 55%)" fill="url(#gradWarn)" strokeWidth={2} name="Warn" />
          <Area type="monotone" dataKey="error" stroke="hsl(0, 72%, 55%)" fill="url(#gradError)" strokeWidth={2} name="Error" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}