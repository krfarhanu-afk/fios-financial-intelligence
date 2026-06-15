import { useState } from "react";
import { GraduationCap, Briefcase, FlaskConical, PenLine, Plus, ExternalLink, Clock, CheckCircle2 } from "lucide-react";

type CareerTab = "mba" | "internships" | "research" | "content";

const MBA_TOPICS = [
  { id: 1, topic: "Private Equity Value Creation", category: "FINANCE", priority: "HIGH", notes: "Study LBO model mechanics, value creation levers (multiple expansion, debt paydown, EBITDA growth). Understand operational vs. financial PE firms.", resources: ["Rosenbaum & Pearl", "WSO PE Course"] },
  { id: 2, topic: "Equity Valuation — DCF & Multiples", category: "FINANCE", priority: "HIGH", notes: "Master the 3-statement model → DCF linkage. Understand WACC components. Know when to use EV/EBITDA vs. P/E vs. P/FCF vs. P/S.", resources: ["Damodaran Valuation", "Berk & DeMarzo"] },
  { id: 3, topic: "Fixed Income & Credit Analysis", category: "FIXED INCOME", priority: "HIGH", notes: "Duration, convexity, yield curve dynamics. Corporate credit analysis (coverage ratios, leverage). Understand the distinction between investment grade and high yield.", resources: ["Fabozzi Handbook", "CFA L1 FI"] },
  { id: 4, topic: "Macroeconomics — IS-LM & Policy", category: "MACRO", priority: "MEDIUM", notes: "IS-LM model, Phillips curve tradeoffs, monetary transmission mechanism. Understand how Fed policy affects asset prices across the yield curve.", resources: ["Mishkin Money & Banking", "Fed papers"] },
  { id: 5, topic: "Behavioral Finance", category: "THEORY", priority: "MEDIUM", notes: "Kahneman & Tversky — prospect theory. Market anomalies: momentum, value, size. Why efficient market hypothesis breaks down in practice.", resources: ["Thinking Fast & Slow", "Shiller Irrational Exuberance"] },
  { id: 6, topic: "Derivatives — Options & Hedging", category: "DERIVATIVES", priority: "MEDIUM", notes: "Black-Scholes intuition (don't memorize formula, understand inputs). Greeks (delta, gamma, theta, vega). How hedge funds use options for risk management.", resources: ["Hull Options Futures", "Natenberg Option Volatility"] },
  { id: 7, topic: "Emerging Markets Investing", category: "EM", priority: "HIGH", notes: "Sovereign risk analysis, currency dynamics (carry trade), political risk premium. Pakistan, India, Indonesia as case studies. IMF program mechanics.", resources: ["Mobius EM Investing", "IMF WEO"] },
  { id: 8, topic: "Financial Statement Analysis", category: "ACCOUNTING", priority: "HIGH", notes: "Quality of earnings analysis. Red flags (aggressive revenue recognition, working capital manipulation). How to read a 10-K vs. how most people read it.", resources: ["Howard Schilit Financial Shenanigans", "CFA L1"] },
];

const INTERNSHIPS = [
  { id: 1, firm: "Goldman Sachs", division: "Investment Management", role: "Summer Analyst — Public Markets", location: "Karachi / Dubai", deadline: "Rolling — Apply ASAP", status: "TO APPLY", type: "ASSET MANAGEMENT", url: "#", notes: "Best brand for long-term sell-side to buy-side transition. Networking critical — reach out to Pak alumni on LinkedIn first." },
  { id: 2, firm: "Arif Habib Group", division: "Investment Banking", role: "Financial Analyst Intern", location: "Karachi, Pakistan", deadline: "Jul 31, 2026", status: "TO APPLY", type: "IB", url: "#", notes: "Best IB training in Pakistan. Deals exposure includes equity issuances, M&A, and IPOs. Strong alumni network in MENA region." },
  { id: 3, firm: "SBP (State Bank of Pakistan)", division: "Monetary Policy", role: "Research Intern", location: "Karachi, Pakistan", deadline: "Jul 15, 2026", status: "APPLIED", type: "CENTRAL BANK", url: "#", notes: "Unique policy perspective. Learn how monetary policy decisions are made. Strong signal for macro/policy-oriented career track." },
  { id: 4, firm: "McKinsey & Company", division: "Financial Services Practice", role: "Business Analyst Intern", location: "Dubai / London", deadline: "Aug 1, 2026", status: "RESEARCHING", type: "CONSULTING", url: "#", notes: "Fastest way to develop structured problem-solving. Financial services practice involves strategy work for banks, insurers, asset managers. Requires PST + case prep (3-6 months)." },
  { id: 5, firm: "Fauji Fertilizer / PSO", division: "Treasury & Finance", role: "Corporate Finance Intern", location: "Islamabad, Pakistan", deadline: "Ongoing", status: "TO APPLY", type: "CORPORATE FINANCE", url: "#", notes: "Large cap Pakistan blue chip exposure. Corporate treasury, FX hedging, capex analysis. Good foundation for CFO-track career." },
];

const RESEARCH_IDEAS = [
  { id: 1, title: "Pakistan Capital Markets Development — A Comparative Study", angle: "Why is KSE-100 so illiquid vs. NSE India? Policy, structural, and behavioral factors.", relevance: "MBA dissertation potential. Unique angle for international applications.", status: "ACTIVE", priority: "HIGH" },
  { id: 2, title: "AI's Impact on Financial Analysis Jobs", angle: "Which finance roles survive AI automation? Probability analysis by job function (equity research, FP&A, trading, M&A).", relevance: "Directly relevant to career positioning and skill development.", status: "EARLY", priority: "HIGH" },
  { id: 3, title: "GLP-1 Drugs & Consumer Behavior Disruption", angle: "Second-order effects on food/beverage, medical devices, insurance. Who wins and who loses?", relevance: "Great for investment thesis development and demonstrates sector analysis depth.", status: "ACTIVE", priority: "MEDIUM" },
  { id: 4, title: "Pakistan's CPEC — Economic Outcomes Analysis", angle: "Has CPEC delivered on promised economic benefits? Debt, jobs, electricity. Honest assessment.", relevance: "Unique local knowledge advantage. Strong signal for EM-focused roles.", status: "IDEA", priority: "MEDIUM" },
  { id: 5, title: "The Rise of the Individual Investor — Retail Democratization", angle: "Robinhood, zero-commission, meme stocks, crypto. Long-term market microstructure implications.", relevance: "Interesting for academic finance but also for fintech investing thesis.", status: "IDEA", priority: "LOW" },
];

const CONTENT_IDEAS = [
  { id: 1, title: "Explaining Pakistan's Economy to the World", format: "LinkedIn Series (5 posts)", angle: "Pakistan's economy in plain English — for international readers who only see the headlines", status: "DRAFTING", engagement: "High potential — unique angle" },
  { id: 2, title: "One Finance Concept Explained Daily", format: "Daily LinkedIn / Twitter", angle: "DCF, WACC, carry trade, yield curve, PE ratio — one per day. Simple language.", status: "ACTIVE", engagement: "Builds audience fast, demonstrates teaching ability" },
  { id: 3, title: "Morning Market Brief — FIOS Dashboard", format: "Daily Newsletter / Post", angle: "Share your FIOS dashboard insight each morning. Position as the 'finance student who thinks like a PM'", status: "PLANNED", engagement: "Creates personal brand moat over 6-12 months" },
  { id: 4, title: "Finance Career from Pakistan — Reality Check", format: "Long-form LinkedIn Article", angle: "Honest guide: local vs. international path, which credentials matter, what nobody tells you", status: "IDEA", engagement: "High shareability among Pakistani finance students" },
  { id: 5, title: "AI Tools for Finance Students", format: "Tutorial Thread", angle: "How to use Claude, ChatGPT, Perplexity for CFA prep, financial modeling, research synthesis", status: "IDEA", engagement: "Very high — practical + trending topic" },
];

const PRIORITY_COLORS = { HIGH: "var(--high-impact)", MEDIUM: "var(--warning)", LOW: "var(--watch)" } as const;
const STATUS_COLORS: Record<string, string> = {
  "TO APPLY": "var(--warning)", "APPLIED": "var(--positive)", "RESEARCHING": "var(--primary)",
  "ACTIVE": "var(--positive)", "EARLY": "var(--primary)", "IDEA": "var(--watch)", "DRAFTING": "var(--warning)", "PLANNED": "var(--muted-foreground)"
};

export function CareerHub() {
  const [activeTab, setActiveTab] = useState<CareerTab>("mba");

  const TABS = [
    { id: "mba" as CareerTab, label: "MBA Topics", icon: GraduationCap, count: MBA_TOPICS.length },
    { id: "internships" as CareerTab, label: "Internships", icon: Briefcase, count: INTERNSHIPS.length },
    { id: "research" as CareerTab, label: "Research Ideas", icon: FlaskConical, count: RESEARCH_IDEAS.length },
    { id: "content" as CareerTab, label: "Content Ideas", icon: PenLine, count: CONTENT_IDEAS.length },
  ];

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="px-4 pt-4 pb-0 shrink-0">
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.14em", marginBottom: 4 }}>LAYER 8</div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 style={{ color: "var(--foreground)", fontSize: 18, fontWeight: 500 }}>Career Intelligence Hub</h1>
            <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>Your finance career OS — MBA prep, opportunities, research, and personal brand.</p>
          </div>
          <button className="flex items-center gap-2 rounded-sm px-3" style={{ background: "var(--primary)", color: "var(--primary-foreground)", height: 32, fontSize: 11, fontWeight: 500 }}>
            <Plus size={12} strokeWidth={2.5} />
            Add Item
          </button>
        </div>

        <div className="flex items-center gap-0 border-b border-border" style={{ borderColor: "var(--border)" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-2 px-4 py-2.5 transition-colors"
                style={{ color: active ? "var(--primary)" : "var(--muted-foreground)", borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent", marginBottom: -1, fontSize: 11, fontWeight: active ? 500 : 400 }}>
                <Icon size={12} />{tab.label}
                <span className="rounded-sm px-1" style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: "var(--muted)", color: "var(--muted-foreground)" }}>{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
        {activeTab === "mba" && (
          <div className="grid gap-2">
            {MBA_TOPICS.map((item) => (
              <div key={item.id} className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{item.topic}</span>
                    <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--primary)", background: "rgba(34,211,238,0.1)", letterSpacing: "0.08em" }}>{item.category}</span>
                  </div>
                  <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS], background: "rgba(0,0,0,0.3)", letterSpacing: "0.08em" }}>
                    {item.priority}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 8 }}>{item.notes}</p>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>RESOURCES:</span>
                  {item.resources.map((r) => (
                    <span key={r} className="rounded-sm px-1.5 py-0.5" style={{ fontSize: 9, color: "var(--foreground)", background: "var(--secondary)", border: "1px solid var(--border)" }}>{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "internships" && (
          <div className="grid gap-3">
            {INTERNSHIPS.map((item) => (
              <div key={item.id} className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span style={{ fontSize: 14, color: "var(--foreground)", fontWeight: 500 }}>{item.firm}</span>
                      <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--primary)", background: "rgba(34,211,238,0.1)", letterSpacing: "0.08em" }}>{item.type}</span>
                      <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: STATUS_COLORS[item.status] || "var(--muted-foreground)", background: "rgba(0,0,0,0.3)", letterSpacing: "0.08em", border: `1px solid ${STATUS_COLORS[item.status] || "var(--border)"}40` }}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.role} · {item.division}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end" style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                      <Clock size={9} />{item.deadline}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--muted-foreground)", marginTop: 2 }}>{item.location}</div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.6 }}>{item.notes}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "research" && (
          <div className="grid gap-3">
            {RESEARCH_IDEAS.map((item) => (
              <div key={item.id} className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-2">
                  <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{item.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: STATUS_COLORS[item.status] || "var(--muted-foreground)", background: "rgba(0,0,0,0.3)", letterSpacing: "0.08em" }}>{item.status}</span>
                    <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS], background: "rgba(0,0,0,0.3)", letterSpacing: "0.08em" }}>{item.priority}</span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6, lineHeight: 1.6 }}><strong style={{ color: "var(--foreground)", fontWeight: 500 }}>Angle:</strong> {item.angle}</p>
                <p style={{ fontSize: 10, color: "var(--muted-foreground)", lineHeight: 1.6 }}><strong style={{ color: "var(--primary)", fontWeight: 500 }}>Why it matters:</strong> {item.relevance}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "content" && (
          <div className="grid gap-3">
            {CONTENT_IDEAS.map((item) => (
              <div key={item.id} className="rounded-sm p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{item.title}</span>
                    <span className="rounded-sm px-1.5 py-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: STATUS_COLORS[item.status] || "var(--muted-foreground)", background: "rgba(0,0,0,0.3)", letterSpacing: "0.08em" }}>{item.status}</span>
                  </div>
                  <span className="rounded-sm px-1.5 py-0.5" style={{ fontSize: 9, color: "var(--muted-foreground)", background: "var(--secondary)", border: "1px solid var(--border)" }}>{item.format}</span>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6, lineHeight: 1.6 }}>{item.angle}</p>
                <div className="flex items-center gap-1.5" style={{ fontSize: 9, color: "var(--positive)" }}>
                  <CheckCircle2 size={10} />
                  {item.engagement}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
