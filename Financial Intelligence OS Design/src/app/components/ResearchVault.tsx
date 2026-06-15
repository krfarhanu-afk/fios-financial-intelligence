import { useState } from "react";
import { FileText, Star, BookOpen, Plus, Search, Tag } from "lucide-react";

type ResTab = "notes" | "theses" | "reports";

const NOTES = [
  { id: 1, title: "Fed Watch — Rate Decision Analysis", date: "Jun 14, 2026", tags: ["MACRO", "RATES"], preview: "If Powell signals only one cut in 2026 vs. the market's two, expect the short end to reprice significantly. The 2Y yield is most sensitive...", starred: true },
  { id: 2, title: "NVDA Earnings Preview", date: "Jun 14, 2026", tags: ["EQUITY", "TECH"], preview: "Data center guidance is the key variable. Management guided $24.6B — consensus is $24.4B. Anything below $24B likely sells off 5%+. The H100 vs. H200 upgrade cycle...", starred: true },
  { id: 3, title: "Pakistan Macro Update — IMF Program", date: "Jun 12, 2026", tags: ["EM", "PAKISTAN"], preview: "SBP cut 150bps to 20.5%. Inflation trending to ~15% by year end. KSE-100 near all-time highs in USD terms. Key risk is political stability ahead of..." , starred: false },
  { id: 4, title: "Oil Supply Disruption — Middle East", date: "Jun 14, 2026", tags: ["COMMODITY", "ENERGY"], preview: "Strait of Hormuz shipping risk elevated. Iranian proxy activity has increased. WTI $82 — if disruption sustained, $90-95 is plausible before OPEC+ response...", starred: false },
  { id: 5, title: "AI Capex Cycle — Hyperscaler Analysis", date: "Jun 10, 2026", tags: ["TECH", "AI"], preview: "Microsoft, Google, Amazon combined 2026 capex guidance: $280B. This has never happened before. The power consumption implications alone change the utilities sector thesis...", starred: false },
  { id: 6, title: "Gold Miners Disconnect", date: "Jun 8, 2026", tags: ["COMMODITY", "GOLD"], preview: "Gold at $2,347 but GDX/GLD ratio at 3-year low. Either gold retreats or miners play catch-up. Historically, this disconnect has closed within 6 months...", starred: false },
];

const THESES = [
  { id: 1, sym: "PLTR", name: "Palantir Technologies", created: "Mar 2026", updated: "Jun 2026", conviction: "HIGH", status: "ACTIVE", thesis: "Palantir has built the operating system for AI deployment at enterprise scale. The AIP platform creates compounding network effects as more client data flows through the system. US Commercial segment growing 52% YoY is the inflection I've been waiting for. The government segment provides a predictable base that funds R&D. The key risk is valuation — at 35x revenue, execution cannot disappoint. Price target: $45 on 3-year horizon.", tags: ["TECHNOLOGY", "AI"] },
  { id: 2, sym: "KRE", name: "Regional Banking Sector", created: "May 2026", updated: "Jun 2026", conviction: "HIGH", status: "ACTIVE", thesis: "The SVB-induced panic of 2023 created a multi-year value opportunity in regional banking. The sector is trading at 8x PE vs. a 10-year average of 13x. Net interest margins are stable and credit quality has held despite doom forecasts. The primary catalyst will be rate cuts — a 100bps reduction in Fed Funds adds ~15% to EPS for interest-rate-sensitive banks. The headline risk (CRE exposure) is real but priced in at current valuations.", tags: ["FINANCIALS", "VALUE"] },
  { id: 3, sym: "INDIA", name: "India Structural Allocation", created: "Jan 2026", updated: "Apr 2026", conviction: "HIGH", status: "ACTIVE", thesis: "India is the decade's most compelling structural growth story. Demographic dividend (median age 28), digital infrastructure (UPI, Aadhaar stack), and manufacturing diversification from China create multi-decade tailwinds. NIFTY 50 at 22x PE is not cheap but justified by 15%+ EPS growth trajectory. Entry on any correction. Not a trade — a 5-10 year allocation thesis.", tags: ["EM", "INDIA", "MACRO"] },
  { id: 4, sym: "GOLD", name: "Gold All-Weather Allocation", created: "Dec 2025", updated: "Jun 2026", conviction: "MEDIUM", status: "ACTIVE", thesis: "Central bank gold buying hitting multi-decade highs (1,000+ tonnes/year). Geopolitical de-dollarization thesis structurally supportive. Real rates likely to decline as Fed cuts. Gold miners (GDX) at extreme discount to spot gold — 3-year low on ratio. 5-10% portfolio allocation to gold/miners as macro hedge.", tags: ["COMMODITY", "MACRO"] },
];

const REPORTS = [
  { id: 1, title: "Goldman Sachs: 2026 Global Equity Outlook", date: "Dec 2025", source: "Goldman Sachs", category: "STRATEGY", tags: ["GLOBAL", "EQUITY"], summary: "GS targets S&P 6,000 for 2026. Key calls: US exceptionalism continues, Japan corporate reform thesis, emerging market selectivity (India over China)." },
  { id: 2, title: "Morgan Stanley: The AI Capex Supercycle", date: "Mar 2026", source: "Morgan Stanley", category: "THEMATIC", tags: ["AI", "TECH"], summary: "Hyperscaler capex guidance of $280B+ in 2026 unprecedented. Power demand implications for utilities. NVIDIA, TSMC, and custom ASIC beneficiaries. Second-order winners: grid infrastructure, cooling, fiber." },
  { id: 3, title: "JP Morgan: Emerging Markets 2026 Guide", date: "Jan 2026", source: "JPMorgan", category: "EM", tags: ["EM", "MACRO"], summary: "India overweight, China neutral, Pakistan underweight (improving). Dollar strength risk for EM. Commodity exporters benefit from supply disruptions. Brazil and Indonesia as secondary ideas." },
  { id: 4, title: "IMF World Economic Outlook — Apr 2026", date: "Apr 2026", source: "IMF", category: "MACRO", tags: ["MACRO", "GLOBAL"], summary: "Global GDP growth 3.2% in 2026. US 2.7%, India 6.8%, China 4.6%, Euro Area 1.2%. Inflation declining but services stickiness remains. Key risk: geopolitical fragmentation reducing trade efficiency." },
  { id: 5, title: "BIS Quarterly Review — Q1 2026", date: "Mar 2026", source: "BIS", category: "RATES", tags: ["RATES", "MACRO"], summary: "Central bank policy divergence creating FX volatility. JPY carry trade risks if BOJ accelerates normalization. EM capital flow reversal risk if USD strengthens materially. Credit spreads near historical tights — limited cushion." },
];

const TAG_COLORS: Record<string, string> = {
  MACRO: "#60a5fa", RATES: "#a78bfa", EQUITY: "var(--positive)", TECH: "var(--primary)",
  COMMODITY: "var(--warning)", ENERGY: "var(--warning)", EM: "#f472b6",
  PAKISTAN: "#4ade80", INDIA: "#fb923c", GLOBAL: "#94a3b8", AI: "var(--primary)",
  FINANCIALS: "#60a5fa", VALUE: "var(--warning)", GOLD: "var(--warning)",
  STRATEGY: "#94a3b8", THEMATIC: "var(--primary)", STRATEGY_EM: "#f472b6",
};

function TagBadge({ tag }: { tag: string }) {
  const color = TAG_COLORS[tag] || "var(--muted-foreground)";
  return (
    <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color, background: color + "18", border: `1px solid ${color}30`, letterSpacing: "0.08em" }}>
      {tag}
    </span>
  );
}

export function ResearchVault() {
  const [activeTab, setActiveTab] = useState<ResTab>("notes");
  const [search, setSearch] = useState("");

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="px-4 pt-4 pb-0 shrink-0">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.14em", marginBottom: 4 }}>LAYER 7</div>
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 500 }}>Research Vault</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-sm px-3" style={{ background: "var(--card)", border: "1px solid var(--border)", height: 32 }}>
              <Search size={12} style={{ color: "var(--muted-foreground)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vault..."
                style={{ background: "transparent", border: "none", outline: "none", fontSize: 11, color: "var(--foreground)", fontFamily: "var(--font-sans)", width: 160 }}
              />
            </div>
            <button className="flex items-center gap-1.5 rounded-sm px-3" style={{ background: "var(--primary)", color: "var(--primary-foreground)", height: 32, fontSize: 11, fontWeight: 500 }}>
              <Plus size={12} strokeWidth={2.5} />
              New Note
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-border" style={{ borderColor: "var(--border)" }}>
          {[{ id: "notes" as ResTab, label: "Notes", icon: FileText, count: NOTES.length },
            { id: "theses" as ResTab, label: "Investment Theses", icon: BookOpen, count: THESES.length },
            { id: "reports" as ResTab, label: "Saved Reports", icon: Star, count: REPORTS.length }].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 transition-colors"
                style={{
                  color: active ? "var(--primary)" : "var(--muted-foreground)",
                  borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                  marginBottom: -1,
                  fontSize: 11,
                  fontWeight: active ? 500 : 400,
                }}
              >
                <Icon size={12} />
                {tab.label}
                <span className="rounded-sm px-1" style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: "var(--muted)", color: "var(--muted-foreground)" }}>{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
        {activeTab === "notes" && (
          <div className="grid gap-2">
            {NOTES.filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase())).map((note) => (
              <div key={note.id} className="rounded-sm p-4 transition-colors" style={{ background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)40")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {note.starred && <Star size={10} style={{ color: "var(--warning)" }} fill="var(--warning)" />}
                      <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{note.title}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)" }}>{note.date}</div>
                  </div>
                  <div className="flex items-center gap-1 ml-3 flex-wrap justify-end" style={{ maxWidth: 200 }}>
                    {note.tags.map((t) => <TagBadge key={t} tag={t} />)}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.6 }}>{note.preview}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "theses" && (
          <div className="grid gap-3">
            {THESES.map((thesis) => (
              <div key={thesis.id} className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--primary)", fontWeight: 600 }}>{thesis.sym}</span>
                    <span style={{ fontSize: 12, color: "var(--foreground)" }}>{thesis.name}</span>
                    <span className="rounded-sm px-2 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: thesis.status === "ACTIVE" ? "var(--positive)" : "var(--muted-foreground)", background: thesis.status === "ACTIVE" ? "rgba(16,185,129,0.12)" : "var(--muted)", letterSpacing: "0.08em" }}>
                      {thesis.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-sm px-2 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: thesis.conviction === "HIGH" ? "var(--high-impact)" : "var(--warning)", background: thesis.conviction === "HIGH" ? "rgba(244,63,94,0.12)" : "rgba(245,158,11,0.12)", letterSpacing: "0.08em" }}>
                      {thesis.conviction} CONVICTION
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {thesis.tags.map((t) => <TagBadge key={t} tag={t} />)}
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.7 }}>{thesis.thesis}</p>
                <div className="flex items-center gap-4 mt-3" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)" }}>
                  <span>CREATED {thesis.created}</span>
                  <span>UPDATED {thesis.updated}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid gap-2">
            {REPORTS.map((report) => (
              <div key={report.id} className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500, marginBottom: 2 }}>{report.title}</div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)" }}>{report.source}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)" }}>{report.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end" style={{ maxWidth: 180 }}>
                    {report.tags.map((t) => <TagBadge key={t} tag={t} />)}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.6 }}>{report.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
