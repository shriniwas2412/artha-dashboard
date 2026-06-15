import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  Tooltip,
} from "recharts";

export default function MiniChart({ data, direction }) {
  const color =
    direction === "up"   ? "var(--green)" :
    direction === "down" ? "var(--red)"   : "var(--text-3)";

  if (!data || data.length < 2) {
    return (
      <div className="mini-chart-empty">
        <span>Waiting for data</span>
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minP = Math.min(...prices) * 0.9998;
  const maxP = Math.max(...prices) * 1.0002;

  return (
    <div className="mini-chart" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis domain={[minP, maxP]} hide />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.length ? (
                <div style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "3px 8px",
                  fontSize: "0.7rem",
                  color,
                  fontFamily: "var(--font-mono)",
                }}>
                  ${payload[0].value.toFixed(2)}
                </div>
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: "none" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
