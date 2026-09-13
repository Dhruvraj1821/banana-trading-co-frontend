import { LineChart, Line, ResponsiveContainer } from "recharts";

interface ValuePoint {
  time: string;
  value: number;
}

export function ResponsiveSparklineImpl({
  history,
  isUp,
}: {
  history: ValuePoint[];
  isUp: boolean;
}) {
  return (
    <ResponsiveContainer>
      <LineChart data={history}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={isUp ? "#4ade80" : "#f87171"}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}