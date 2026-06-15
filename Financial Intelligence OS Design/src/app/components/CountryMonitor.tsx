import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

function spark(seed: number, len = 24) {
  const d = [];
  let v = 100;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (Math.sin(seed * 3.9 + i * 1.2) * 0.018 + Math.cos(seed * 2.1 + i) * 0.01));
    d.push({ v: +v.toFixed(3) });
  }
  return d;
}

interface MacroStat { label: string; value: string; note: string }
interface Country {
  id: string;
  name: string;
  flag: string;
  region: string;
  equityIndex: string;
  indexValue: string;
  indexChange: number;
  currency: string;
  currencyVsUSD: string;
  currencyChange: number;
  gdpGrowth: string;
  inflation: string;
  interestRate: string;
  macro: MacroStat[];
  narrative: string;
  risks: string[];
  seed: number;
}

const COUNTRIES: Country[] = [
  {
    id: "us", name: "United States", flag: "🇺🇸", region: "NORTH AMERICA",
    equityIndex: "S&P 500", indexValue: "5,847", indexChange: 0.42,
    currency: "USD", currencyVsUSD: "1.0000", currencyChange: 0,
    gdpGrowth: "+2.8%", inflation: "3.4%", interestRate: "5.25%",
    seed: 1,
    macro: [
      { label: "GDP Growth (Q1)", value: "+2.8%", note: "Above consensus" },
      { label: "CPI (YoY)", value: "3.4%", note: "Decelerating" },
      { label: "Unemployment", value: "3.9%", note: "Near historic lows" },
      { label: "Fed Funds Rate", value: "5.25%", note: "Hold expected tomorrow" },
      { label: "10Y Treasury", value: "4.352%", note: "8-month high" },
      { label: "DXY Index", value: "104.38", note: "Strengthening trend" },
    ],
    narrative: "The US economy remains resilient despite elevated rates. Soft landing thesis intact, with labor market strength offsetting housing sector weakness. Fed expected to begin rate cuts in September if inflation continues to moderate. AI-driven productivity gains support corporate margins.",
    risks: ["Fiscal deficit ($1.7T) sustainability", "Commercial real estate stress", "Geopolitical escalation impact on energy"],
  },
  {
    id: "pk", name: "Pakistan", flag: "🇵🇰", region: "SOUTH ASIA",
    equityIndex: "KSE-100", indexValue: "79,242", indexChange: 1.84,
    currency: "PKR", currencyVsUSD: "278.52", currencyChange: -0.03,
    gdpGrowth: "+2.4%", inflation: "17.3%", interestRate: "20.5%",
    seed: 2,
    macro: [
      { label: "GDP Growth (FY24)", value: "+2.4%", note: "Recovery from crisis" },
      { label: "CPI (YoY)", value: "17.3%", note: "Declining from 38% peak" },
      { label: "SBP Policy Rate", value: "20.5%", note: "Easing cycle underway" },
      { label: "FX Reserves", value: "$9.1B", note: "~2 months import cover" },
      { label: "Current Account", value: "-$1.1B", note: "Improving" },
      { label: "IMF Program", value: "$7B", note: "EFF approved Jul 2024" },
    ],
    narrative: "Pakistan is navigating a post-IMF stabilization phase with declining inflation enabling SBP rate cuts. KSE-100 has been one of the world's best performing markets in USD terms, recovering from 2023 crisis lows. Key risks remain external financing and energy sector circular debt.",
    risks: ["External debt refinancing cliff (2025-26)", "Energy circular debt ($14B+)", "Political instability & governance uncertainty"],
  },
  {
    id: "in", name: "India", flag: "🇮🇳", region: "SOUTH ASIA",
    equityIndex: "NIFTY 50", indexValue: "22,531", indexChange: 0.71,
    currency: "INR", currencyVsUSD: "83.42", currencyChange: -0.08,
    gdpGrowth: "+7.6%", inflation: "4.8%", interestRate: "6.50%",
    seed: 3,
    macro: [
      { label: "GDP Growth (FY25E)", value: "+7.6%", note: "Fastest major economy" },
      { label: "CPI (YoY)", value: "4.8%", note: "Within RBI 2-6% band" },
      { label: "RBI Repo Rate", value: "6.50%", note: "Hold, easing ahead" },
      { label: "FX Reserves", value: "$643B", note: "Near all-time high" },
      { label: "Current Account", value: "-1.2% GDP", note: "Manageable" },
      { label: "FDI Inflows", value: "+$70B", note: "Manufacturing push" },
    ],
    narrative: "India is the structural growth story of the decade. Demographic dividend, infrastructure buildout, and manufacturing diversification (China+1 strategy) are multi-year tailwinds. Domestic consumption + services exports create a balanced growth model. Strong institutional governance and democratic stability add quality premium.",
    risks: ["Monsoon variability and food inflation", "China border tensions", "Oil import bill sensitivity to crude prices"],
  },
  {
    id: "cn", name: "China", flag: "🇨🇳", region: "EAST ASIA",
    equityIndex: "CSI 300", indexValue: "3,542", indexChange: -0.31,
    currency: "CNY", currencyVsUSD: "7.242", currencyChange: -0.12,
    gdpGrowth: "+4.8%", inflation: "0.3%", interestRate: "3.45%",
    seed: 4,
    macro: [
      { label: "GDP Growth (Q1 2026)", value: "+4.8%", note: "Below 5% target" },
      { label: "CPI (YoY)", value: "0.3%", note: "Deflation risk remains" },
      { label: "LPR 1Y", value: "3.45%", note: "PBOC easing" },
      { label: "Exports (YoY)", value: "+8.7%", note: "EV & solar drive" },
      { label: "FX Reserves", value: "$3.24T", note: "Stable" },
      { label: "Property Sector", value: "Stressed", note: "Ongoing correction" },
    ],
    narrative: "China faces structural headwinds from property sector deleveraging and deflationary pressures despite strong export performance. Policy stimulus has been incremental rather than decisive. Western supply chain diversification away from China is an emerging structural risk. Watch for major stimulus announcement.",
    risks: ["Property sector systemic risk (Evergrande, Country Garden)", "Deflationary spiral if stimulus insufficient", "Taiwan Strait geopolitical escalation"],
  },
  {
    id: "jp", name: "Japan", flag: "🇯🇵", region: "EAST ASIA",
    equityIndex: "Nikkei 225", indexValue: "38,804", indexChange: 0.55,
    currency: "JPY", currencyVsUSD: "157.42", currencyChange: -0.43,
    gdpGrowth: "+0.8%", inflation: "2.7%", interestRate: "0.10%",
    seed: 5,
    macro: [
      { label: "GDP Growth (Q4 2025)", value: "+0.8%", note: "Recovering" },
      { label: "CPI (YoY)", value: "2.7%", note: "Sustained above target" },
      { label: "BOJ Policy Rate", value: "0.10%", note: "Hiking cycle emerging" },
      { label: "USD/JPY", value: "157.42", note: "Near 34-year low for JPY" },
      { label: "Current Account", value: "+¥2.1T", note: "Surplus" },
      { label: "Nikkei Valuation", value: "16.2x PE", note: "Reasonable vs. history" },
    ],
    narrative: "Japan is experiencing its first sustained inflation in decades, prompting the BOJ's historic policy shift away from negative rates. Corporate governance reforms, record Nikkei highs, and Buffett's Japan investment thesis support the bullish case. Weak yen is a double-edged sword — boosting exporters but squeezing importers.",
    risks: ["BOJ policy normalization pace uncertainty", "Carry trade unwind risk (JPY at 157)", "Demographic pressure on domestic demand"],
  },
  {
    id: "uk", name: "United Kingdom", flag: "🇬🇧", region: "EUROPE",
    equityIndex: "FTSE 100", indexValue: "8,241", indexChange: 0.28,
    currency: "GBP", currencyVsUSD: "1.2814", currencyChange: 0.08,
    gdpGrowth: "+0.4%", inflation: "3.2%", interestRate: "5.00%",
    seed: 6,
    macro: [
      { label: "GDP Growth (Q1)", value: "+0.4%", note: "Recovering from recession" },
      { label: "CPI (YoY)", value: "3.2%", note: "Above BoE 2% target" },
      { label: "BoE Base Rate", value: "5.00%", note: "First cut in Aug?" },
      { label: "GBP/USD", value: "1.2814", note: "Stable" },
      { label: "Gilt 10Y", value: "4.28%", note: "In line with UST" },
      { label: "Unemployment", value: "4.3%", note: "Rising slowly" },
    ],
    narrative: "UK economy is stabilizing after a technical recession. Energy price normalization has brought inflation lower, creating space for BoE rate cuts. FTSE 100 benefits from high energy/financial sector weight. Post-Brexit trade frictions remain a structural drag on services exports.",
    risks: ["Sticky services inflation delays BoE cuts", "Housing market stress at high rates", "Post-Brexit trade arrangement uncertainty"],
  },
  {
    id: "de", name: "Germany", flag: "🇩🇪", region: "EUROPE",
    equityIndex: "DAX", indexValue: "18,312", indexChange: -0.18,
    currency: "EUR", currencyVsUSD: "1.0872", currencyChange: -0.11,
    gdpGrowth: "-0.2%", inflation: "2.4%", interestRate: "4.00%",
    seed: 7,
    macro: [
      { label: "GDP Growth (2025)", value: "-0.2%", note: "Second contraction year" },
      { label: "CPI (YoY)", value: "2.4%", note: "Near ECB target" },
      { label: "ECB Deposit Rate", value: "4.00%", note: "Cutting cycle started" },
      { label: "EUR/USD", value: "1.0872", note: "Range-bound" },
      { label: "Bund 10Y", value: "2.52%", note: "ECB cut expectations" },
      { label: "PMI Mfg.", value: "44.7", note: "Contraction for 24 months" },
    ],
    narrative: "Germany faces a structural industrial challenge with high energy costs, Chinese competition in autos, and underinvestment in digitalization. ECB rate cuts offer some relief but the manufacturing model requires fundamental reform. Fiscal constraints limit government stimulus capacity.",
    risks: ["Industrial competitiveness vs. China (autos, chemicals)", "Energy transition costs without Russian gas", "Political fragmentation hindering reform"],
  },
];

export function CountryMonitor() {
  const [selected, setSelected] = useState("us");
  const country = COUNTRIES.find((c) => c.id === selected)!;
  const indexUp = country.indexChange >= 0;
  const fxUp = country.currencyChange >= 0;

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.14em", marginBottom: 4 }}>LAYER 4</div>
        <h1 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 500 }}>Country Monitor</h1>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Country List */}
        <div className="shrink-0 border-r border-border overflow-y-auto" style={{ width: 200, borderColor: "var(--border)" }}>
          {COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className="w-full text-left px-3 py-3 transition-colors"
              style={{
                background: selected === c.id ? "var(--secondary)" : "transparent",
                borderLeft: selected === c.id ? "2px solid var(--primary)" : "2px solid transparent",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 16 }}>{c.flag}</span>
                  <div>
                    <div style={{ fontSize: 11, color: selected === c.id ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: selected === c.id ? 500 : 400 }}>{c.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--muted-foreground)", letterSpacing: "0.08em", marginTop: 1 }}>{c.region}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: c.indexChange >= 0 ? "var(--positive)" : "var(--negative)", textAlign: "right" }}>
                  {c.indexChange >= 0 ? "+" : ""}{c.indexChange.toFixed(2)}%
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Country Detail */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <span style={{ fontSize: 36 }}>{country.flag}</span>
            <div>
              <h2 style={{ fontSize: 20, color: "var(--foreground)", fontWeight: 500 }}>{country.name}</h2>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em", marginTop: 2 }}>{country.region}</div>
            </div>
            <div className="flex gap-4 ml-4">
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>{country.equityIndex}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--foreground)", fontWeight: 600 }}>{country.indexValue}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: indexUp ? "var(--positive)" : "var(--negative)" }}>
                  {indexUp ? "+" : ""}{country.indexChange.toFixed(2)}%
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>{country.currency}/USD</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--foreground)", fontWeight: 600 }}>{country.currencyVsUSD}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: fxUp ? "var(--positive)" : "var(--negative)" }}>
                  {fxUp ? "+" : ""}{country.currencyChange.toFixed(2)}%
                </div>
              </div>
              {[{ l: "GDP Growth", v: country.gdpGrowth }, { l: "Inflation", v: country.inflation }, { l: "Int. Rate", v: country.interestRate }].map((stat) => (
                <div key={stat.l}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>{stat.l}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--foreground)", fontWeight: 600, marginTop: 4 }}>{stat.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sparkline */}
          <div className="rounded-sm mb-4 px-3 pt-2 pb-1" style={{ background: "var(--card)", border: "1px solid var(--border)", height: 80 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em", marginBottom: 4 }}>{country.equityIndex} — 30D</div>
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={spark(country.seed)} margin={{ top: 2, right: 4, bottom: 2, left: 4 }}>
                <Area type="monotone" dataKey="v" stroke={indexUp ? "var(--positive)" : "var(--negative)"} fill={(indexUp ? "var(--positive)" : "var(--negative)") + "15"} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Macro Grid */}
          <div className="rounded-sm mb-3 p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em", marginBottom: 10 }}>MACRO INDICATORS</div>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {country.macro.map((m) => (
                <div key={m.label} className="rounded-sm p-2" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--muted-foreground)", letterSpacing: "0.06em", marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--foreground)", fontWeight: 600 }}>{m.value}</div>
                  <div style={{ fontSize: 9, color: "var(--muted-foreground)", marginTop: 2 }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative + Risks */}
          <div className="grid gap-3" style={{ gridTemplateColumns: "3fr 2fr" }}>
            <div className="rounded-sm p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--primary)", letterSpacing: "0.1em", marginBottom: 8 }}>AI COUNTRY NARRATIVE</div>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{country.narrative}</p>
            </div>
            <div className="rounded-sm p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--negative)", letterSpacing: "0.1em", marginBottom: 8 }}>KEY RISKS</div>
              {country.risks.map((r, i) => (
                <div key={i} className="flex gap-2 py-1.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--negative)", fontSize: 10, marginTop: 1 }}>▼</span>
                  <span style={{ fontSize: 10, color: "var(--foreground)", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
