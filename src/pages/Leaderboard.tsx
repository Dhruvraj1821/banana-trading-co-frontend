import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useUser } from "../context/UserContext";
import { PixelPanel } from "../components/PixelPanel";
import { PixelSpinner } from "../components/PixelSpinner";
import { PageContainer } from "../components/PageContainer";
import { PnlValue } from "../components/PnlValue";
import type { LeaderboardEntry, CreatorLeaderboardEntry } from "../types/api";

type Tab = "networth" | "roi" | "creators";

export function Leaderboard() {
  const { user } = useUser();
  const [tab, setTab] = useState<Tab>("networth");
  const [networth, setNetworth] = useState<LeaderboardEntry[] | null>(null);
  const [roi, setRoi] = useState<LeaderboardEntry[] | null>(null);
  const [creators, setCreators] = useState<CreatorLeaderboardEntry[] | null>(null);

  useEffect(() => {
    api.getLeaderboardNetworth().then(setNetworth);
    api.getLeaderboardRoi().then(setRoi);
    api.getLeaderboardCreators().then(setCreators);
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "networth", label: "net worth" },
    { key: "roi", label: "roi %" },
    { key: "creators", label: "top creators" },
  ];

  return (
    <PageContainer>
      <h1 className="font-pixel text-banana text-2xl mb-6">Leaderboard</h1>

      <div className="flex gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`font-pixel text-xs px-3 py-2 border-2 border-border ${
              tab === t.key ? "bg-banana text-bg" : "bg-panel text-text-dim"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <PixelPanel>
        {tab === "networth" &&
          (networth === null ? (
            <PixelSpinner label="loading..." />
          ) : (
            <RankedList
              rows={networth.map((e) => ({
                id: e.user_id,
                username: e.username,
                value: `$${e.net_worth.toFixed(2)}`,
              }))}
              currentUserId={user?.id}
            />
          ))}

        {tab === "roi" &&
          (roi === null ? (
            <PixelSpinner label="loading..." />
          ) : (
            <RankedList
              rows={roi.map((e) => ({
                id: e.user_id,
                username: e.username,
                value: <PnlValue value={e.roi_pct} suffix="%" />,
              }))}
              currentUserId={user?.id}
            />
          ))}

        {tab === "creators" &&
          (creators === null ? (
            <PixelSpinner label="loading..." />
          ) : creators.length === 0 ? (
            <p className="font-data text-text-dim text-sm py-4">
              nobody has created a card yet.
            </p>
          ) : (
            <RankedList
              rows={creators.map((e) => ({
                id: e.user_id,
                username: e.username,
                value: `$${e.total_trading_volume.toFixed(2)} vol · ${e.card_count} card${e.card_count === 1 ? "" : "s"}`,
              }))}
              currentUserId={user?.id}
            />
          ))}
      </PixelPanel>
    </PageContainer>
  );
}

interface RankedRow {
  id: string;
  username: string;
  value: React.ReactNode;
}

function RankedList({
  rows,
  currentUserId,
}: {
  rows: RankedRow[];
  currentUserId?: string;
}) {
  if (rows.length === 0) {
    return <p className="font-data text-text-dim text-sm py-4">no data yet.</p>;
  }

  return (
    <div className="flex flex-col">
      {rows.map((row, index) => {
        const isYou = row.id === currentUserId;
        return (
          <div
            key={row.id}
            className={`font-data text-sm flex justify-between items-center py-2 ${
              index !== rows.length - 1 ? "border-b border-border" : ""
            } ${isYou ? "text-banana" : "text-text"}`}
          >
            <span>
              <span className="text-text-dim inline-block w-6">{index + 1}.</span>
              {row.username}
              {isYou && <span className="text-xs ml-1">(you)</span>}
            </span>
            <span>{row.value}</span>
          </div>
        );
      })}
    </div>
  );
}