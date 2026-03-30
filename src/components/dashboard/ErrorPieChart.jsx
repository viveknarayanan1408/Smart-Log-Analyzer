import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "hsl(175, 70%, 45%)",
  "hsl(260, 60%, 60%)",
  "hsl(35, 90%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(200, 75%, 55%)",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="text-xs font-medium text-foreground">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">Count: <span className="font-semibold text-foreground">{payload[0].value}</span></p>
    </div>
  );
};

export default function ErrorPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Top Errors</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No errors detected
        </div>
      </div>
    );
  }

  const chartData = data.slice(0, 5).map(e => ({ name: e.message?.slice(0, 40) || "Unknown", value: e.count }));

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Top Errors</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-muted-foreground truncate">{item.name}</span>
            <span className="ml-auto font-mono font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}