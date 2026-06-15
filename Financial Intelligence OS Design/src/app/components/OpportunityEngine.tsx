import { useState } from "react";
import { TrendingUp, BarChart2, Activity, DollarSign, ChevronUp, ChevronDown } from "lucide-react";

type OpTab = "value" | "growth" | "momentum" | "dividend";

const TABS: { id: OpTab; label: string; icon: React.ElementType; color: string; description: string }[] = [
  { id: "value", label: "Value", icon: DollarSign, color: "var(--warning)", description: "Stocks trading below historical valuation — PE, PB, or DCF discount" },
  { id: "growth", label: "Growth", icon: TrendingUp, color: "var(--positive)", description: "Revenue or earnings acceleration detected in recent quarters" },
  { id: "momentum", label: "Momentum", icon: Activity, color: "var(--primary)", description: "Strong technical trends with institutional accumulation signals" },
  { id: "dividend", label: "Dividend", icon: BarChart2, color: "#a78bfa", description: "High-quality dividend candidates with sustainable payout ratios" },
];

interface Opportunity {
  sym: string;
  name: string;
  price: string;
  change: number;
  metric: string;
  metricVal: string;
  thesis: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  sector: string;
}

const VALUE_OPPS: Opportunity[] = [
  { sym: "KRE", name: "SPDR Regional Banking ETF", price: "$47.84", change: 0.93, metric: "PE vs. Hist.", metricVal: "8.2x (avg 13x)", priority: "HIGH", sector: "FINANCIALS", thesis: "Regional banks trading at 37% discount to 10-year average PE. NIM expansion and credit quality holding. Oversold from SVB contagion fear that has not materialized." },
  { sym: "PFE", name: "Pfizer Inc.", price: "$26.41", change: -0.34, metric: "P/FCF", metricVal: "9.1x vs. 16x avg", priority: "HIGH", sector: "HEALTHCARE", thesis: "Post-COVID normalization has created a deep value setup. Pipeline includes 24 Phase 3 candidates. Dividend yield at 6.2% covered by free cash flow. Consensus too negative on oncology pipeline." },
  { sym: "INTC", name: "Intel Corporation", price: "$31.22", change: 0.84, metric: "P/Book", metricVal: "1.1x vs. hist. 2.8x", priority: "MEDIUM", sector: "TECHNOLOGY", thesis: "Turnaround thesis under new CEO. Foundry business could be valued separately at $50+. Trading at 1.1x book — near GFC lows. US CHIPS Act subsidies de-risk capex." },
  { sym: "MPW", name: "Medical Properties Trust", price: "$4.82", change: -1.24, metric: "P/NAV", metricVal: "52% discount", priority: "LOW", sector: "REAL ESTATE", thesis: "Extreme discount to NAV with significant execution risk. Steward hospital operator in bankruptcy. High leverage. Only for risk-tolerant investors with long time horizons." },
  { sym: "CVS", name: "CVS Health Corp.", price: "$54.72", change: 0.41, metric: "Forward PE", metricVal: "7.8x vs. 12x avg", priority: "MEDIUM", sector: "HEALTHCARE", thesis: "Healthcare services integration strategy misunderstood by market. Oak Street + Aetna combination creates vertically integrated healthcare OS. Cash flow supports current valuation." },
];

const GROWTH_OPPS: Opportunity[] = [
  { sym: "AXON", name: "Axon Enterprise", price: "$284.41", change: 2.14, metric: "Rev. Growth", metricVal: "+33% YoY", priority: "HIGH", sector: "TECHNOLOGY", thesis: "Digital evidence management platform creating a data network effect. Taser hardware drives software subscription attach rates. Law enforcement SaaS has very high switching costs and government contract stability." },
  { sym: "APP", name: "AppLovin Corp.", price: "$78.42", change: 3.81, metric: "EBITDA Growth", metricVal: "+187% YoY", priority: "HIGH", sector: "TECHNOLOGY", thesis: "AI-powered mobile advertising platform with extraordinary margin expansion. AXON 2.0 ad tech generating returns far above expectations. One of the fastest EBITDA growth stories in software." },
  { sym: "CRWD", name: "CrowdStrike Holdings", price: "$334.11", change: 1.24, metric: "ARR Growth", metricVal: "+34% YoY", priority: "MEDIUM", sector: "TECHNOLOGY", thesis: "Platform consolidation in cybersecurity benefits CrowdStrike. Falcon platform reaching inflection on module adoption. Post-July outage concern created opportunity in fundamentally strong name." },
  { sym: "CELH", name: "Celsius Holdings", price: "$42.18", change: -0.88, metric: "Rev. Growth", metricVal: "+18% YoY", priority: "MEDIUM", sector: "CONSUMER", thesis: "Still one of the fastest-growing energy drink brands despite post-peak slowdown. International expansion (EU, Asia) in early innings. Distribution deal with PepsiCo de-risks execution risk." },
  { sym: "PLTR", name: "Palantir Technologies", price: "$24.82", change: 1.42, metric: "US Comm Rev.", metricVal: "+52% YoY", priority: "HIGH", sector: "TECHNOLOGY", thesis: "Commercial segment AI platform adoption is accelerating. AIP bootcamp model generating strong pipeline conversion. Government business provides cash flow stability. First company to genuinely operationalize AI at enterprise scale." },
];

const MOMENTUM_OPPS: Opportunity[] = [
  { sym: "XLE", name: "Energy Select Sector SPDR", price: "$92.41", change: 3.14, metric: "vs. 200-DMA", metricVal: "+8.4% breakout", priority: "HIGH", sector: "ENERGY", thesis: "Energy sector breaking out on WTI surge. Strong relative strength vs. S&P 500. Institutional positioning underweight. Oil supply disruption + OPEC discipline = sustained momentum." },
  { sym: "GDX", name: "VanEck Gold Miners ETF", price: "$32.84", change: 2.41, metric: "Gold/GDX Ratio", metricVal: "3Y extreme", priority: "HIGH", sector: "MATERIALS", thesis: "Gold miners trading at extreme discount to gold spot price. Ratio at 3-year lows despite gold at all-time highs. If gold holds, miners have significant catch-up potential. Operational leverage amplifies gold price moves." },
  { sym: "META", name: "Meta Platforms", price: "$513.20", change: 1.67, metric: "52W Rank", metricVal: "Top 3%", priority: "HIGH", sector: "COMM. SVCS", thesis: "Consistent 52-week momentum with institutional accumulation. Year of Efficiency narrative proven. AI assistant reaching 1B users — potential new monetization layer not in consensus estimates." },
  { sym: "BRK.B", name: "Berkshire Hathaway B", price: "$408.72", change: 0.84, metric: "Institutional Flow", metricVal: "Net accumulation", priority: "MEDIUM", sector: "FINANCIALS", thesis: "Outperforming S&P YTD with near-record cash balance ($170B) providing dry powder optionality. Defensive momentum in uncertain macro environment. Warren Buffett legacy premium." },
];

const DIVIDEND_OPPS: Opportunity[] = [
  { sym: "BTI", name: "British American Tobacco", price: "$31.84", change: 0.41, metric: "Dividend Yield", metricVal: "9.8%", priority: "HIGH", sector: "CONSUMER STAP.", thesis: "Near-10% dividend yield covered 1.6x by free cash flow. Transitioning to next-gen products (vaping, heated tobacco). Deep value with income. Risk: regulatory tightening and smoking volume decline." },
  { sym: "VZ", name: "Verizon Communications", price: "$40.12", change: 0.21, metric: "Dividend Yield", metricVal: "6.7%", priority: "MEDIUM", sector: "TELECOM", thesis: "6.7% yield at 13-year lows. Free cash flow generation improving as capex cycle peaks. Dividend coverage at 1.4x FCF. Rate sensitive — benefits from anticipated Fed cuts." },
  { sym: "LYB", name: "LyondellBasell Industries", price: "$88.41", change: 0.64, metric: "Dividend Yield", metricVal: "6.1%", priority: "MEDIUM", sector: "MATERIALS", thesis: "Chemical sector cycle bottom thesis. 6.1% yield from one of the world's lowest-cost producers. Management committed to dividend through cycle. China demand recovery is the key catalyst." },
  { sym: "MO", name: "Altria Group", price: "$44.72", change: 0.18, metric: "Dividend Yield", metricVal: "8.9%", priority: "MEDIUM", sector: "CONSUMER STAP.", thesis: "Dividend king with 54 consecutive years of increases. Smoke-free transition (on! pouches, NJOY e-cigarettes) providing organic growth. FCF generation remains very strong despite volume decline." },
  { sym: "PFE", name: "Pfizer Inc.", price: "$26.41", change: -0.34, metric: "Dividend Yield", metricVal: "6.2%", priority: "HIGH", sector: "HEALTHCARE", thesis: "Post-COVID normalization creating an unusual 6.2% yield for a large-cap pharma. 24 Phase 3 pipeline candidates provide upside optionality. Dividend payout ratio sustainable on FCF basis." },
];

const DATA_MAP: Record<OpTab, Opportunity[]> = {
  value: VALUE_OPPS,
  growth: GROWTH_OPPS,
  momentum: MOMENTUM_OPPS,
  dividend: DIVIDEND_OPPS,
};

const PRIORITY_COLORS = { HIGH: "var(--high-impact)", MEDIUM: "var(--warning)", LOW: "var(--watch)" };

function OppCard({ opp, color }: { opp: Opportunity; color: string }) {
  return (
    <div className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>{opp.sym}</span>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{opp.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: opp.sector === "TECHNOLOGY" ? "var(--primary)" : "var(--muted-foreground)", background: "var(--secondary)", letterSpacing: "0.08em" }}>
            {opp.sector}
          </span>
          <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: PRIORITY_COLORS[opp.priority], background: "rgba(0,0,0,0.3)", letterSpacing: "0.08em", border: `1px solid ${PRIORITY_COLORS[opp.priority]}40` }}>
            {opp.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--foreground)", fontWeight: 500 }}>{opp.price}</div>
          <div className="flex items-center gap-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: opp.change >= 0 ? "var(--positive)" : "var(--negative)" }}>
            {opp.change >= 0 ? <ChevronUp size={9} strokeWidth={3} /> : <ChevronDown size={9} strokeWidth={3} />}
            {opp.change >= 0 ? "+" : ""}{opp.change.toFixed(2)}%
          </div>
        </div>
        <div className="rounded-sm px-3 py-1.5" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>{opp.metric}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color, fontWeight: 600 }}>{opp.metricVal}</div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.65 }}>{opp.thesis}</p>
    </div>
  );
}

export function OpportunityEngine() {
  const [activeTab, setActiveTab] = useState<OpTab>("value");
  const activeTabData = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="px-4 pt-4 pb-0 shrink-0">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.14em", marginBottom: 4 }}>LAYER 6</div>
        <h1 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Opportunity Engine</h1>

        {/* Tab bar */}
        <div className="flex items-stretch gap-2 mb-4">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-sm transition-colors"
                style={{
                  background: active ? "var(--card)" : "var(--secondary)",
                  border: active ? `1px solid ${tab.color}60` : "1px solid var(--border)",
                  color: active ? tab.color : "var(--muted-foreground)",
                  boxShadow: active ? `0 0 0 1px ${tab.color}20` : "none",
                }}
              >
                <Icon size={13} strokeWidth={active ? 2 : 1.5} />
                <span style={{ fontSize: 12, fontWeight: active ? 500 : 400 }}>{tab.label}</span>
                <span className="rounded-sm px-1" style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: active ? tab.color + "20" : "var(--muted)", color: active ? tab.color : "var(--muted-foreground)" }}>
                  {DATA_MAP[tab.id].length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description */}
        <div className="rounded-sm px-4 py-2.5 mb-4" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{activeTabData.description}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))" }}>
          {DATA_MAP[activeTab].map((opp) => (
            <OppCard key={opp.sym} opp={opp} color={activeTabData.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
