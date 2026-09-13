import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PortfolioItem } from "../types/api";

const PALETTE = ["#ffd93d", "#4ade80", "#f87171", "#60a5fa", "#c084fc", "#fb923c"];

export function AllocationChart({ holdings }: { holdings: PortfolioItem[] }) {
  const data = holdings.map((h) => ({ name: h.card_name, value: h.market_value }));

  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
            {data.map((_, index) => (
              <Cell key={index} fill={PALETTE[index % PALETTE.length]} stroke="#000" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#17171f",
              border: "2px solid #000",
              fontFamily: "JetBrains Mono",
              fontSize: 12,
            }}
            formatter={(value) => `$${Number(value).toFixed(2)}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}