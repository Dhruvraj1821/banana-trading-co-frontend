interface PnlValueProps {
  value: number;
  suffix?: string;
}

export function PnlValue({ value, suffix = "" }: PnlValueProps) {
  const isPositive = value >= 0;
  return (
    <span className={isPositive ? "text-gain" : "text-loss"}>
      {isPositive ? "+" : ""}
      {value.toFixed(2)}
      {suffix}
    </span>
  );
}