import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, TrendingUp, Eye, ChevronRight, ChevronUp, ChevronDown, Minus } from "lucide-react";

function spark(seed: number, len = 20, vol = 0.015) {
  const d = [];
  let v = 100;
  for (let i = 0; i < len; i++) {
    v = v * (1 + (Math.sin(seed * 7.3 + i * 1.7) * vol + Math.cos(seed * 3.1 + i) * vol * 0.5));
    d.push({ v: +v.toFixed(2) });
  }
  return d;
}

const HIGH_IMPACT = [
  { label: "Fed Meeting", detail: "Tomorrow 14:00 EST — Rate decision expected", category: "MACRO" },
  { label: "NVIDIA Earnings", detail: "Tonight AH — Est. $5.57 EPS, Rev. $24.6B", category: "EQUITY" },
  { label: "Treasury Yield Breakout", detail: "10Y crosses 4.35% — 8-month high", category: "RATES" },
  { label: "WTI Oil +5.2%", detail: "Supply disruption, Middle East tensions", category: "COMMODITY" },
];

const OPPORTUNITIES = [
  { label: "Regional Banks", detail: "KRE -18% YTD — Oversold vs. historical PE", tag: "VALUE" },
  { label: "Energy Sector", detail: "Oil breakout + underweight positioning", tag: "MOMENTUM" },
  { label: "Gold Miners", detail: "GDX lagging gold spot — ratio at 3Y low", tag: "PAIRS" },
];

const WATCH = [
  { label: "Healthcare", detail: "Election risk + GLP-1 narrative" },
  { label: "Utilities", detail: "Rate sensitive — watch 10Y" },
  { label: "REITs", detail: "Office fundamentals deteriorating" },
];

const MACRO_INDICATORS = [
  { label: "S&P 500", value: "5,847", change: "+0.42%", up: true, seed: 1 },
  { label: "VIX", value: "14.23", change: "-5.21%", up: false, seed: 2 },
  { label: "DXY", value: "104.38", change: "+0.14%", up: true, seed: 3 },
  { label: "10Y Yield", value: "4.352%", change: "+0.8bp", up: true, seed: 4 },
  { label: "Gold", value: "$2,347", change: "+0.63%", up: true, seed: 5 },
  { label: "WTI Oil", value: "$82.14", change: "+5.18%", up: true, seed: 6 },
];

const SECTOR_PULSE = [
  { label: "Energy", change: 3.14, seed: 7 },
  { label: "Technology", change: 1.22, seed: 8 },
  { label: "Financials", change: 0.84, seed: 9 },
  { label: "Industrials", change: 0.41, seed: 10 },
  { label: "Consumer Disc.", change: 0.19, seed: 11 },
  { label: "Materials", change: -0.08, seed: 12 },
  { label: "Healthcare", change: -0.34, seed: 13 },
  { label: "Utilities", change: -0.62, seed: 14 },
];

function MiniSpark({ seed, up }: { seed: number; up: boolean }) {
  const color = up ? "var(--positive)" : "var(--negative)";
  return (
    <ResponsiveContainer width={60} height={24}>
      <AreaChart data={spark(seed)} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <Area type="monotone" dataKey="v" stroke={color} fill={color + "18"} strokeWidth={1.2} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SectionHeader({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={12} style={{ color }} strokeWidth={2.5} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color, letterSpacing: "0.12em", fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

export function CommandCenter() {
  return (
    <div className="h-full overflow-y-auto p-4" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Priority Header */}
      <div className="flex items-center justify-between">
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.14em", marginBottom: 2 }}>
            FINANCIAL INTELLIGENCE OS
          </div>
          <h1 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>
            Command Center
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-sm px-3 py-1.5" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>TODAY</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--foreground)", marginTop: 1 }}>MON · JUN 15, 2026</div>
          </div>
        </div>
      </div>

      {/* Priority Triptych */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        {/* HIGH IMPACT */}
        <div className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)", borderTop: "2px solid var(--high-impact)" }}>
          <SectionHeader icon={AlertTriangle} label="HIGH IMPACT" color="var(--high-impact)" />
          <div className="flex flex-col gap-2">
            {HIGH_IMPACT.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5 py-2 border-b border-border last:border-0" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>{item.label}</span>
                  <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--high-impact)", background: "rgba(244,63,94,0.12)", letterSpacing: "0.08em" }}>
                    {item.category}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OPPORTUNITIES */}
        <div className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)", borderTop: "2px solid var(--warning)" }}>
          <SectionHeader icon={TrendingUp} label="OPPORTUNITIES" color="var(--warning)" />
          <div className="flex flex-col gap-2">
            {OPPORTUNITIES.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5 py-2 border-b border-border last:border-0" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>{item.label}</span>
                  <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--warning)", background: "rgba(245,158,11,0.12)", letterSpacing: "0.08em" }}>
                    {item.tag}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4 }}>{item.detail}</span>
              </div>
            ))}
            <div className="rounded-sm p-2 mt-1" style={{ background: "rgba(245,158,11,0.06)", border: "1px dashed rgba(245,158,11,0.25)" }}>
              <div style={{ fontSize: 10, color: "var(--warning)", fontWeight: 500 }}>+4 more in Opportunity Engine →</div>
            </div>
          </div>
        </div>

        {/* WATCH */}
        <div className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)", borderTop: "2px solid var(--watch)" }}>
          <SectionHeader icon={Eye} label="WATCH LIST" color="var(--watch)" />
          <div className="flex flex-col gap-2">
            {WATCH.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5 py-2 border-b border-border last:border-0" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <Minus size={10} style={{ color: "var(--watch)" }} />
                  <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.4, paddingLeft: 16 }}>{item.detail}</span>
              </div>
            ))}
          </div>

          {/* AI Narrative */}
          <div className="mt-4 rounded-sm p-3" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--primary)", letterSpacing: "0.12em", marginBottom: 6 }}>AI NARRATIVE</div>
            <p style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              Markets are positioned for a risk-on posture ahead of tomorrow's Fed decision.
              Energy breakout + resilient tech earnings suggest continued S&P leadership.
              Main tail risk: yield curve steepening on hawkish surprise.
            </p>
          </div>
        </div>
      </div>

      {/* Macro + Sector Row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "2fr 1fr" }}>
        {/* Macro Pulse */}
        <div className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.12em", marginBottom: 12 }}>
            MACRO PULSE
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {MACRO_INDICATORS.map((ind) => (
              <div key={ind.label} className="flex items-center justify-between rounded-sm p-2" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", marginBottom: 2 }}>{ind.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--foreground)", fontWeight: 500 }}>{ind.value}</div>
                  <div
                    className="flex items-center gap-0.5 mt-0.5"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: ind.up ? "var(--positive)" : "var(--negative)" }}
                  >
                    {ind.up ? <ChevronUp size={9} strokeWidth={2.5} /> : <ChevronDown size={9} strokeWidth={2.5} />}
                    {ind.change}
                  </div>
                </div>
                <MiniSpark seed={ind.seed} up={ind.up} />
              </div>
            ))}
          </div>
        </div>

        {/* Sector Pulse */}
        <div className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.12em", marginBottom: 12 }}>
            SECTOR PULSE — 1D
          </div>
          <div className="flex flex-col gap-1.5">
            {SECTOR_PULSE.map((s) => {
              const up = s.change >= 0;
              const w = Math.min(Math.abs(s.change) * 20, 100);
              return (
                <div key={s.label} className="flex items-center gap-2">
                  <div style={{ fontSize: 10, color: "var(--muted-foreground)", width: 96, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.label}
                  </div>
                  <div className="flex-1 h-4 rounded-sm overflow-hidden" style={{ background: "var(--secondary)" }}>
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${w}%`,
                        background: up ? "var(--positive)" : "var(--negative)",
                        opacity: 0.7,
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: up ? "var(--positive)" : "var(--negative)", width: 48, textAlign: "right" }}>
                    {up ? "+" : ""}{s.change.toFixed(2)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
