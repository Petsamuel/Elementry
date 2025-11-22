import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "motion/react";
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-obsidian border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ComparisonView({ pivots }) {
  // Prepare data for Radar Chart (Overall Metrics)
  const radarData = [
    { metric: "Viability", fullMark: 100 },
    { metric: "Market Fit", fullMark: 100 },
    { metric: "Progress", fullMark: 100 },
    { metric: "Risk Safety", fullMark: 100 }, // Inverted Risk (Low Risk = High Safety)
    { metric: "Action %", fullMark: 100 },
  ];

  // Map pivot data to radar format
  pivots.forEach((pivot, index) => {
    const analysis = pivot.analysis || {};
    const riskScore =
      {
        low: 90,
        medium: 60,
        "medium-high": 40,
        high: 20,
      }[analysis.risk_level?.toLowerCase()] || 50;

    const actionPercent =
      analysis.actions_total > 0
        ? Math.round(
            (analysis.actions_completed / analysis.actions_total) * 100
          )
        : 0;

    radarData[0][`pivot_${index}`] = analysis.viability_score || 0;
    radarData[1][`pivot_${index}`] = analysis.market_fit_score || 0;
    radarData[2][`pivot_${index}`] = analysis.progress_percentage || 0;
    radarData[3][`pivot_${index}`] = riskScore;
    radarData[4][`pivot_${index}`] = actionPercent;
  });

  // Prepare data for Bar Chart (Financials & Timeline)
  const barData = pivots.map((pivot, index) => {
    const analysis = pivot.analysis || {};
    // Parse investment string to number (e.g. "$5k-$10k" -> 7.5)
    // For simplicity, let's take the lower bound if range, or just parse
    let investment = 0;
    if (analysis.estimated_investment) {
      const matches = analysis.estimated_investment.match(/\d+/g);
      if (matches && matches.length > 0) {
        investment = parseInt(matches[0]);
      }
    }

    return {
      name: pivot.pivot_name,
      Timeline: analysis.estimated_timeline_weeks || 0,
      Investment: investment, // in k$
      index,
    };
  });

  const colors = ["#c8ff16", "#9d4edd", "#3b82f6"]; // Accent, Primary, Blue

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-obsidian border border-white/5 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Strategic Alignment
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                {pivots.map((pivot, index) => (
                  <Radar
                    key={pivot.id}
                    name={pivot.pivot_name}
                    dataKey={`pivot_${index}`}
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.3}
                  />
                ))}
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart - Timeline vs Investment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-obsidian border border-white/5 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Resource Requirements
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff10"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#9ca3af"
                  width={100}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    borderColor: "#333",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar
                  dataKey="Timeline"
                  name="Weeks"
                  fill="#9d4edd"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="Investment"
                  name="Est. Cost (k$)"
                  fill="#c8ff16"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-obsidian border border-white/5 rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Detailed Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/5 text-gray-400">
                <th className="p-4 font-medium">Metric</th>
                {pivots.map((pivot, index) => (
                  <th
                    key={pivot.id}
                    className="p-4 font-medium"
                    style={{ color: colors[index % colors.length] }}
                  >
                    {pivot.pivot_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-4 text-gray-300 font-medium">
                  Viability Score
                </td>
                {pivots.map((pivot) => (
                  <td key={pivot.id} className="p-4 text-white font-mono">
                    {pivot.analysis?.viability_score}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-gray-300 font-medium">Market Fit</td>
                {pivots.map((pivot) => (
                  <td key={pivot.id} className="p-4 text-white">
                    {pivot.analysis?.market_fit}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-gray-300 font-medium">Risk Level</td>
                {pivots.map((pivot) => (
                  <td key={pivot.id} className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        pivot.analysis?.risk_level?.toLowerCase() === "low"
                          ? "bg-green-500/20 text-green-400"
                          : pivot.analysis?.risk_level?.toLowerCase() ===
                            "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {pivot.analysis?.risk_level?.toUpperCase()}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-gray-300 font-medium">Est. Timeline</td>
                {pivots.map((pivot) => (
                  <td key={pivot.id} className="p-4 text-white">
                    {pivot.analysis?.estimated_timeline}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-gray-300 font-medium">
                  Est. Investment
                </td>
                {pivots.map((pivot) => (
                  <td key={pivot.id} className="p-4 text-white">
                    {pivot.analysis?.estimated_investment}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-gray-300 font-medium">Progress</td>
                {pivots.map((pivot) => (
                  <td key={pivot.id} className="p-4 text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{
                            width: `${
                              pivot.analysis?.progress_percentage || 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs">
                        {pivot.analysis?.progress_percentage}%
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
