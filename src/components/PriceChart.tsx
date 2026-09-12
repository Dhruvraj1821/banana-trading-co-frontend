import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PricePoint } from "../hooks/useCardPriceStream";
import { computeTrend } from "../lib/chartHelpers";

interface PriceChartProps {
  history: PricePoint[];
}

function CustomDot(props: any) {
  const { cx, cy, payload, index, dataLength } = props;
  const isLatest = index === dataLength - 1;

  if (payload.event === "initial" && !isLatest) return null;

  if (isLatest) {
    return (
      <circle cx={cx} cy={cy} r={5} fill="#ffd93d" stroke="#000" strokeWidth={1.5}>
        <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" />
      </circle>
    );
  }

  if (payload.event === "trade") {
    return <circle cx={cx} cy={cy} r={3.5} fill="#ffd93d" stroke="#000" strokeWidth={1} />;
  }

  return <circle cx={cx} cy={cy} r={2} fill="#8a8a96" />;
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const point: PricePoint = payload[0].payload;
  const eventLabel = { initial: "start", trade: "trade", drift: "market drift" }[point.event];

  return (
    <div
      className="font-data text-xs bg-panel border-2 border-border p-2"
      style={{ boxShadow: "3px 3px 0px #000" }}
    >
      <p className="text-banana">${point.price.toFixed(4)}</p>
      <p className="text-text-dim">{eventLabel} · {point.time}</p>
    </div>
  );
}

export function PriceChart({ history }: PriceChartProps) {
  const { isUp, changePct } = computeTrend(history);
  const lineColor = isUp ? "#4ade80" : "#f87171";
  const dataWithIndex = history.map((point, index) => ({
    ...point,
    index,
    dataLength: history.length,
  }));

  return (
    <div>
      <p className={`font-data text-sm mb-2 ${isUp ? "text-gain" : "text-loss"}`}>
        {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
        {changePct.toFixed(2)}% since you've been watching
      </p>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <AreaChart data={dataWithIndex}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontFamily: "JetBrains Mono", fontSize: 11 }}
              stroke="#8a8a96"
              width={55}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              fill="url(#priceFill)"
              dot={<CustomDot />}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}