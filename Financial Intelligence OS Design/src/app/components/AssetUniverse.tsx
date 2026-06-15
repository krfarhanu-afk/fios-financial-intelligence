import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ChevronUp, ChevronDown } from "lucide-react";

function spark(seed: number, len = 24, vol = 0.018) {
  const d = [];
  let v = 100;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (Math.sin(seed * 5.7 + i * 1.4) * vol + Math.cos(seed * 2.9 + i * 0.8) * vol * 0.6));
    d.push({ v: +v.toFixed(3) });
  }
  return d;
}

function Spark({ seed, up }: { seed: number; up: boolean }) {
  const color = up ? "var(--positive)" : "var(--negative)";
  return (
    <ResponsiveContainer width={72} height={28}>
      <AreaChart data={spark(seed)} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <Area type="monotone" dataKey="v" stroke={color} fill={color + "20"} strokeWidth={1.2} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface Asset {
  sym: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
  mktcap?: string;
  seed: number;
}

const EQUITIES: Asset[] = [
  { sym: "AAPL", name: "Apple Inc.", price: "$192.34", change: "+1.22%", up: true, mktcap: "$2.94T", seed: 1 },
  { sym: "MSFT", name: "Microsoft Corp.", price: "$421.80", change: "+0.87%", up: true, mktcap: "$3.13T", seed: 2 },
  { sym: "NVDA", name: "NVIDIA Corp.", price: "$875.43", change: "+3.41%", up: true, mktcap: "$2.16T", seed: 3 },
  { sym: "AMZN", name: "Amazon.com Inc.", price: "$186.22", change: "+0.54%", up: true, mktcap: "$1.95T", seed: 4 },
  { sym: "GOOGL", name: "Alphabet Inc.", price: "$174.81", change: "-0.32%", up: false, mktcap: "$2.14T", seed: 5 },
  { sym: "META", name: "Meta Platforms", price: "$513.20", change: "+1.67%", up: true, mktcap: "$1.31T", seed: 6 },
  { sym: "TSLA", name: "Tesla Inc.", price: "$177.44", change: "-1.84%", up: false, mktcap: "$565B", seed: 7 },
  { sym: "JPM", name: "JPMorgan Chase", price: "$198.72", change: "+0.93%", up: true, mktcap: "$567B", seed: 8 },
  { sym: "V", name: "Visa Inc.", price: "$279.61", change: "+0.41%", up: true, mktcap: "$566B", seed: 9 },
  { sym: "XOM", name: "Exxon Mobil", price: "$116.38", change: "+4.21%", up: true, mktcap: "$464B", seed: 10 },
  { sym: "UNH", name: "UnitedHealth Group", price: "$489.20", change: "-0.77%", up: false, mktcap: "$452B", seed: 11 },
  { sym: "WMT", name: "Walmart Inc.", price: "$68.41", change: "+0.28%", up: true, mktcap: "$548B", seed: 12 },
];

const FIXED_INCOME: Asset[] = [
  { sym: "UST 2Y", name: "2-Year Treasury", price: "4.875%", change: "+2bp", up: false, seed: 21 },
  { sym: "UST 5Y", name: "5-Year Treasury", price: "4.512%", change: "+1.5bp", up: false, seed: 22 },
  { sym: "UST 10Y", name: "10-Year Treasury", price: "4.352%", change: "+0.8bp", up: false, seed: 23 },
  { sym: "UST 30Y", name: "30-Year Treasury", price: "4.521%", change: "+0.3bp", up: false, seed: 24 },
  { sym: "TIP", name: "TIPS 10Y (REAL)", price: "2.14%", change: "+0.5bp", up: false, seed: 25 },
  { sym: "IG CORP", name: "Inv. Grade Corp.", price: "5.24%", change: "-2bp", up: true, seed: 26 },
  { sym: "HY CORP", name: "High Yield Corp.", price: "7.83%", change: "-5bp", up: true, seed: 27 },
  { sym: "MUNI 10Y", name: "Muni Bond 10Y", price: "3.12%", change: "-1bp", up: true, seed: 28 },
];

const COMMODITIES: Asset[] = [
  { sym: "GOLD", name: "Gold Spot", price: "$2,347.40", change: "+0.63%", up: true, seed: 31 },
  { sym: "SILVER", name: "Silver Spot", price: "$29.84", change: "+1.12%", up: true, seed: 32 },
  { sym: "WTI", name: "WTI Crude Oil", price: "$82.14", change: "+5.18%", up: true, seed: 33 },
  { sym: "BRENT", name: "Brent Crude", price: "$86.41", change: "+4.93%", up: true, seed: 34 },
  { sym: "NATGAS", name: "Natural Gas", price: "$2.68", change: "+2.31%", up: true, seed: 35 },
  { sym: "COPPER", name: "Copper HG", price: "$4.51", change: "-0.44%", up: false, seed: 36 },
  { sym: "CORN", name: "Corn", price: "$442.5", change: "-0.88%", up: false, seed: 37 },
  { sym: "WHEAT", name: "Wheat", price: "$584.25", change: "+1.74%", up: true, seed: 38 },
];

const CURRENCIES: Asset[] = [
  { sym: "EUR/USD", name: "Euro / US Dollar", price: "1.0872", change: "-0.11%", up: false, seed: 41 },
  { sym: "GBP/USD", name: "Sterling / Dollar", price: "1.2814", change: "+0.08%", up: true, seed: 42 },
  { sym: "USD/JPY", name: "Dollar / Yen", price: "157.42", change: "+0.43%", up: true, seed: 43 },
  { sym: "USD/CHF", name: "Dollar / Franc", price: "0.8934", change: "-0.21%", up: false, seed: 44 },
  { sym: "USD/CAD", name: "Dollar / CAD", price: "1.3612", change: "+0.14%", up: true, seed: 45 },
  { sym: "AUD/USD", name: "AUD / Dollar", price: "0.6584", change: "-0.34%", up: false, seed: 46 },
  { sym: "DXY", name: "US Dollar Index", price: "104.38", change: "+0.14%", up: true, seed: 47 },
  { sym: "PKR/USD", name: "Pakistani Rupee", price: "278.52", change: "+0.03%", up: false, seed: 48 },
];

const DIGITAL: Asset[] = [
  { sym: "BTC", name: "Bitcoin", price: "$67,421", change: "+2.34%", up: true, mktcap: "$1.33T", seed: 51 },
  { sym: "ETH", name: "Ethereum", price: "$3,812", change: "+1.87%", up: true, mktcap: "$458B", seed: 52 },
  { sym: "SOL", name: "Solana", price: "$174.22", change: "+3.12%", up: true, mktcap: "$80B", seed: 53 },
  { sym: "BNB", name: "BNB Chain", price: "$587.40", change: "+0.84%", up: true, mktcap: "$86B", seed: 54 },
  { sym: "AVAX", name: "Avalanche", price: "$37.84", change: "-1.22%", up: false, mktcap: "$16B", seed: 55 },
  { sym: "USDT", name: "Tether USD", price: "$1.0001", change: "0.00%", up: true, mktcap: "$112B", seed: 56 },
  { sym: "LINK", name: "Chainlink", price: "$14.82", change: "+2.71%", up: true, mktcap: "$9B", seed: 57 },
  { sym: "DOT", name: "Polkadot", price: "$7.34", change: "-0.88%", up: false, mktcap: "$10B", seed: 58 },
];

const ALTERNATIVES: Asset[] = [
  { sym: "VNQ", name: "Vanguard REIT ETF", price: "$84.72", change: "-0.41%", up: false, seed: 61 },
  { sym: "IVR", name: "INVESCO Mortgage", price: "$8.41", change: "+0.72%", up: true, seed: 62 },
  { sym: "GLD", name: "SPDR Gold Trust", price: "$220.84", change: "+0.61%", up: true, seed: 63 },
  { sym: "SLV", name: "iShares Silver", price: "$28.14", change: "+1.04%", up: true, seed: 64 },
  { sym: "PDBC", name: "Invesco Commodity", price: "$14.92", change: "+1.82%", up: true, seed: 65 },
  { sym: "BX", name: "Blackstone (PE)", price: "$127.84", change: "+1.14%", up: true, seed: 66 },
];

type Tab = "equities" | "fixed-income" | "commodities" | "currencies" | "digital" | "alternatives";

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: "equities", label: "Equities", count: 12 },
  { id: "fixed-income", label: "Fixed Income", count: 8 },
  { id: "commodities", label: "Commodities", count: 8 },
  { id: "currencies", label: "Currencies", count: 8 },
  { id: "digital", label: "Digital Assets", count: 8 },
  { id: "alternatives", label: "Alternatives", count: 6 },
];

function AssetRow({ a }: { a: Asset }) {
  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded-sm transition-colors"
      style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div className="w-20 shrink-0">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)", fontWeight: 600 }}>{a.sym}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 11, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
      </div>
      {a.mktcap && (
        <div className="hidden lg:block w-20 shrink-0 text-right">
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>{a.mktcap}</div>
        </div>
      )}
      <div className="w-20 shrink-0 flex justify-end">
        <Spark seed={a.seed} up={a.up} />
      </div>
      <div className="w-24 shrink-0 text-right">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>{a.price}</div>
        <div
          className="flex items-center justify-end gap-0.5"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: a.up ? "var(--positive)" : "var(--negative)" }}
        >
          {a.up ? <ChevronUp size={9} strokeWidth={3} /> : <ChevronDown size={9} strokeWidth={3} />}
          {a.change}
        </div>
      </div>
    </div>
  );
}

const DATA_MAP: Record<Tab, Asset[]> = {
  equities: EQUITIES,
  "fixed-income": FIXED_INCOME,
  commodities: COMMODITIES,
  currencies: CURRENCIES,
  digital: DIGITAL,
  alternatives: ALTERNATIVES,
};

export function AssetUniverse() {
  const [activeTab, setActiveTab] = useState<Tab>("equities");

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-0 shrink-0">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.14em", marginBottom: 4 }}>
          LAYER 2
        </div>
        <h1 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Global Asset Universe</h1>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-border" style={{ borderColor: "var(--border)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 transition-colors"
              style={{
                fontSize: 11,
                fontWeight: activeTab === tab.id ? 500 : 400,
                color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                marginBottom: -1,
                background: "transparent",
              }}
            >
              {tab.label}
              <span
                className="rounded-sm px-1"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  background: activeTab === tab.id ? "rgba(34,211,238,0.15)" : "var(--muted)",
                  color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-2 pb-4">
          {/* Column headers */}
          <div className="flex items-center gap-3 py-1.5 px-3 mb-1">
            <div className="w-20 shrink-0" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>SYMBOL</div>
            <div className="flex-1" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>NAME</div>
            <div className="hidden lg:block w-20 shrink-0 text-right" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>MKT CAP</div>
            <div className="w-20 shrink-0" />
            <div className="w-24 shrink-0 text-right" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>PRICE · CHG</div>
          </div>
          <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
            {DATA_MAP[activeTab].map((a) => (
              <AssetRow key={a.sym} a={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
