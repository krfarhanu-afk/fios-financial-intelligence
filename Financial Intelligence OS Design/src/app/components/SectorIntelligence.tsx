import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, AreaChart, Area } from "recharts";
import { ChevronUp, ChevronDown, TrendingUp, AlertTriangle, Newspaper } from "lucide-react";

function spark(seed: number, len = 30) {
  const d = [];
  let v = 100;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (Math.sin(seed * 4.1 + i * 1.3) * 0.02 + Math.cos(seed * 2.7 + i * 0.9) * 0.01));
    d.push({ v: +v.toFixed(3) });
  }
  return d;
}

interface Sector {
  id: string;
  name: string;
  etf: string;
  perf1d: number;
  perf1w: number;
  perfYTD: number;
  pe: string;
  topHoldings: string[];
  catalysts: string[];
  risks: string[];
  news: string[];
  seed: number;
}

const SECTORS: Sector[] = [
  {
    id: "tech", name: "Technology", etf: "XLK",
    perf1d: 1.22, perf1w: 2.84, perfYTD: 18.4,
    pe: "32.1x", seed: 1,
    topHoldings: ["AAPL 22%", "MSFT 20%", "NVDA 18%", "AVGO 4%", "ORCL 3%"],
    catalysts: ["AI capex cycle acceleration", "iPhone 17 supercycle thesis", "Cloud re-acceleration"],
    risks: ["High valuations vs. historical", "Rate sensitivity at 32x PE", "China revenue exposure (AAPL)"],
    news: ["NVIDIA guides +100% YoY data center revenue", "Microsoft Azure beats estimates for 6th quarter", "Apple confirms India manufacturing expansion"],
  },
  {
    id: "financials", name: "Financials", etf: "XLF",
    perf1d: 0.84, perf1w: 1.12, perfYTD: 9.2,
    pe: "14.8x", seed: 2,
    topHoldings: ["BRK.B 13%", "JPM 11%", "V 6%", "MA 5%", "BAC 4%"],
    catalysts: ["Net interest margin expansion", "Strong M&A pipeline recovery", "Deregulation tailwinds"],
    risks: ["Commercial real estate exposure", "Credit normalization cycle", "Deposit competition"],
    news: ["JPMorgan raises dividend 10%", "Goldman sees 25% M&A revenue growth", "Regional bank stress tests results due Friday"],
  },
  {
    id: "energy", name: "Energy", etf: "XLE",
    perf1d: 3.14, perf1w: 5.82, perfYTD: 11.7,
    pe: "11.2x", seed: 3,
    topHoldings: ["XOM 24%", "CVX 16%", "COP 5%", "EOG 4%", "SLB 4%"],
    catalysts: ["Middle East supply disruption", "OPEC+ production discipline", "Offshore capex recovery"],
    risks: ["Energy transition policy risk", "Demand destruction if WTI > $90", "US shale supply response"],
    news: ["WTI crude surges 5% on supply disruption fears", "ExxonMobil announces $20B buyback program", "OPEC+ affirms production cut through Q3"],
  },
  {
    id: "healthcare", name: "Healthcare", etf: "XLV",
    perf1d: -0.34, perf1w: -0.88, perfYTD: 3.1,
    pe: "20.4x", seed: 4,
    topHoldings: ["LLY 14%", "UNH 11%", "JNJ 7%", "ABBV 6%", "MRK 5%"],
    catalysts: ["GLP-1 obesity market expansion", "Aging demographics structural tailwind", "Medicare Advantage growth"],
    risks: ["Drug pricing reform legislation", "Election year policy uncertainty", "GLP-1 competition intensifying"],
    news: ["Eli Lilly tirzepatide shows kidney disease benefit", "UnitedHealth faces pricing scrutiny from Senate", "Pfizer announces $5.5B restructuring plan"],
  },
  {
    id: "consumer-disc", name: "Consumer Disc.", etf: "XLY",
    perf1d: 0.19, perf1w: -0.32, perfYTD: 5.8,
    pe: "25.6x", seed: 5,
    topHoldings: ["AMZN 23%", "TSLA 13%", "HD 7%", "MCD 5%", "NKE 4%"],
    catalysts: ["Soft landing consumer resilience", "Amazon Prime ecosystem strength", "Travel spending normalization"],
    risks: ["Lower-income consumer stress", "Tesla pricing war margin impact", "Student loan repayment burden"],
    news: ["Amazon expands same-day delivery to 50 new cities", "Tesla cuts prices again in China market", "Home Depot lowers outlook citing weak housing market"],
  },
  {
    id: "industrials", name: "Industrials", etf: "XLI",
    perf1d: 0.41, perf1w: 0.73, perfYTD: 7.3,
    pe: "22.1x", seed: 6,
    topHoldings: ["GE 5%", "RTX 5%", "HON 5%", "CAT 5%", "UPS 4%"],
    catalysts: ["Reshoring capex cycle", "Defense spending acceleration", "Infrastructure bill deployment"],
    risks: ["PMI contraction signal", "Freight volume weakness", "Labor cost inflation"],
    news: ["GE Aerospace backlog hits record $200B", "Caterpillar sees strong emerging market demand", "Union Pacific reports volume recovery"],
  },
  {
    id: "materials", name: "Materials", etf: "XLB",
    perf1d: -0.08, perf1w: 0.31, perfYTD: 1.4,
    pe: "18.7x", seed: 7,
    topHoldings: ["LIN 17%", "APD 6%", "SHW 6%", "FCX 5%", "NEM 4%"],
    catalysts: ["Gold miner leverage to gold breakout", "Copper demand from EV transition", "Lithium supply normalization"],
    risks: ["China demand slowdown", "Commodity price volatility", "Energy input cost pressure"],
    news: ["Freeport-McMoRan sees copper demand surge on AI buildout", "Newmont expands African mining operations", "Lithium prices stabilize after 2023 crash"],
  },
  {
    id: "utilities", name: "Utilities", etf: "XLU",
    perf1d: -0.62, perf1w: -1.14, perfYTD: -2.1,
    pe: "17.2x", seed: 8,
    topHoldings: ["NEE 14%", "SO 8%", "DUK 7%", "AEP 5%", "EXC 5%"],
    catalysts: ["AI data center power demand surge", "Rate cut potential (rate-sensitive)", "Clean energy transition capex"],
    risks: ["Elevated rates suppress sector appeal", "Wildfire liability (CA utilities)", "Regulatory rate case uncertainty"],
    news: ["NextEra Energy raises dividend 10% on data center demand", "Duke Energy wins rate case approval in North Carolina", "Texas grid operator warns of summer capacity crunch"],
  },
  {
    id: "consumer-stap", name: "Consumer Staples", etf: "XLP",
    perf1d: 0.12, perf1w: 0.44, perfYTD: 4.2,
    pe: "21.8x", seed: 9,
    topHoldings: ["WMT 15%", "COST 11%", "PG 10%", "KO 8%", "PEP 7%"],
    catalysts: ["Defensive rotation on recession fears", "Private label market share stabilization", "Emerging market volume growth"],
    risks: ["Volume pressure from food inflation", "Private label competition", "GLP-1 impact on snack/beverage volumes"],
    news: ["Walmart reports strong grocery market share gains", "Coca-Cola raises FY guidance on pricing power", "Procter & Gamble sees volume recovery in Asia"],
  },
  {
    id: "real-estate", name: "Real Estate", etf: "XLRE",
    perf1d: -0.41, perf1w: -0.92, perfYTD: -3.8,
    pe: "28.4x", seed: 10,
    topHoldings: ["PLD 10%", "AMT 8%", "EQIX 7%", "CCI 6%", "PSA 5%"],
    catalysts: ["Rate cut cycle beginning (interest rate sensitive)", "Data center REIT AI demand", "Industrial REIT e-commerce tailwind"],
    risks: ["Office fundamentals deteriorating", "Elevated cap rates vs. NOI", "Refinancing pressure at higher rates"],
    news: ["Prologis raises industrial REIT outlook on e-commerce", "Equinix expands data center capacity for AI workloads", "Office REIT Vornado extends debt maturity"],
  },
  {
    id: "comm", name: "Communication Svcs.", etf: "XLC",
    perf1d: 0.78, perf1w: 1.33, perfYTD: 14.2,
    pe: "23.1x", seed: 11,
    topHoldings: ["META 22%", "GOOGL 16%", "GOOG 14%", "NFLX 5%", "DIS 3%"],
    catalysts: ["Digital advertising recovery", "AI-driven content recommendation monetization", "Streaming profitability inflection"],
    risks: ["Regulatory antitrust risk (Google, Meta)", "Ad spend cyclicality", "China revenue exposure"],
    news: ["Meta AI assistant reaches 1B users in Q1", "Google faces EU antitrust fine over search practices", "Netflix password sharing crackdown boosts subscribers"],
  },
];

export function SectorIntelligence() {
  const [selected, setSelected] = useState("tech");
  const sector = SECTORS.find((s) => s.id === selected)!;

  const chartData = spark(sector.seed, 30);
  const up = sector.perf1d >= 0;

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.14em", marginBottom: 4 }}>LAYER 3</div>
        <h1 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 500 }}>Sector Intelligence</h1>
      </div>

      <div className="flex-1 overflow-hidden flex gap-0">
        {/* Sector List */}
        <div className="shrink-0 overflow-y-auto border-r border-border" style={{ width: 200, borderColor: "var(--border)" }}>
          {SECTORS.map((s) => {
            const isActive = s.id === selected;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className="w-full text-left flex items-center justify-between px-3 py-2.5 transition-colors"
                style={{
                  background: isActive ? "var(--secondary)" : "transparent",
                  borderLeft: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: isActive ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: isActive ? 500 : 400 }}>{s.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: isActive ? "var(--primary)" : "var(--muted-foreground)", marginTop: 1 }}>{s.etf}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: s.perf1d >= 0 ? "var(--positive)" : "var(--negative)", textAlign: "right" }}>
                  {s.perf1d >= 0 ? "+" : ""}{s.perf1d.toFixed(2)}%
                </div>
              </button>
            );
          })}
        </div>

        {/* Sector Detail */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 style={{ fontSize: 20, color: "var(--foreground)", fontWeight: 500 }}>{sector.name}</h2>
                <span className="rounded-sm px-2 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 10, background: "var(--secondary)", color: "var(--primary)", border: "1px solid var(--border)" }}>
                  {sector.etf}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {[{ label: "1D", val: sector.perf1d }, { label: "1W", val: sector.perf1w }, { label: "YTD", val: sector.perfYTD }].map((p) => (
                <div key={p.label} className="text-right">
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>{p.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: p.val >= 0 ? "var(--positive)" : "var(--negative)", fontWeight: 600 }}>
                    {p.val >= 0 ? "+" : ""}{p.val.toFixed(2)}%
                  </div>
                </div>
              ))}
              <div className="text-right">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>P/E</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--foreground)", fontWeight: 600 }}>{sector.pe}</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-sm mb-4 p-3" style={{ background: "var(--card)", border: "1px solid var(--border)", height: 100 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <Area type="monotone" dataKey="v" stroke={up ? "var(--positive)" : "var(--negative)"} fill={(up ? "var(--positive)" : "var(--negative)") + "15"} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Grid */}
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {/* Top Holdings */}
            <div className="rounded-sm p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={11} style={{ color: "var(--primary)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>TOP HOLDINGS</span>
              </div>
              {sector.topHoldings.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--foreground)" }}>{h.split(" ")[0]}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>{h.split(" ")[1]}</span>
                </div>
              ))}
            </div>

            {/* Catalysts */}
            <div className="rounded-sm p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <ChevronUp size={11} style={{ color: "var(--positive)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>CATALYSTS</span>
              </div>
              {sector.catalysts.map((c, i) => (
                <div key={i} className="flex gap-2 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--positive)", marginTop: 2 }}>▲</span>
                  <span style={{ fontSize: 10, color: "var(--foreground)", lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>

            {/* Risks */}
            <div className="rounded-sm p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={11} style={{ color: "var(--negative)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>RISKS</span>
              </div>
              {sector.risks.map((r, i) => (
                <div key={i} className="flex gap-2 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--negative)", marginTop: 2 }}>▼</span>
                  <span style={{ fontSize: 10, color: "var(--foreground)", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* News */}
          <div className="rounded-sm p-3 mt-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Newspaper size={11} style={{ color: "var(--primary)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>NEWS INTELLIGENCE</span>
            </div>
            <div className="flex flex-col gap-2">
              {sector.news.map((n, i) => (
                <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", marginTop: 1, minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 11, color: "var(--foreground)", lineHeight: 1.5 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
