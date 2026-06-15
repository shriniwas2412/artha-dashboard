import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";

/**
 * MiniChart — compact live Recharts line chart showing last 30 price points.
 * Color changes based on direction (up = green, down = red).
 */
export default function MiniChart({ data, direction }) {
  const strokeColor =
    direction === "up"
      ? "#22c55e"
      : direction === "down"
      ? "#f43f5e"
      : "#8896b3";

  const gradientId = `chart-gradient-${direction}`;

  if (!data || data.length < 2) {
    return (
      <div className="mini-chart" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>Loading chart…</span>
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.9995;
  const maxPrice = Math.max(...prices) * 1.0005;

  return (
    <div className="mini-chart" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.5} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={1} />
            </linearGradient>
          </defs>
          <YAxis domain={[minPrice, maxPrice]} hide />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div
                    style={{
                      background: "rgba(13, 20, 33, 0.95)",
                      border: `1px solid ${strokeColor}`,
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      color: strokeColor,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    ${payload[0].value.toFixed(2)}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={`url(#${gradientId})`}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: strokeColor, stroke: "none" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
