import { useState, useEffect } from "react";
import { Search, Bell, ChevronUp, ChevronDown } from "lucide-react";

const TICKERS = [
  { sym: "SPX", price: "5,847.22", change: "+0.42%", up: true },
  { sym: "NDX", price: "20,312.11", change: "+0.78%", up: true },
  { sym: "DJI", price: "42,186.34", change: "+0.21%", up: true },
  { sym: "VIX", price: "14.23", change: "-5.21%", up: false },
  { sym: "10Y", price: "4.352%", change: "+0.8bp", up: true },
  { sym: "DXY", price: "104.38", change: "+0.14%", up: true },
  { sym: "GOLD", price: "2,347.40", change: "+0.63%", up: true },
  { sym: "WTI", price: "82.14", change: "+5.18%", up: true },
  { sym: "BTC", price: "67,421", change: "+2.34%", up: true },
  { sym: "ETH", price: "3,812", change: "+1.87%", up: true },
  { sym: "EUR/USD", price: "1.0872", change: "-0.11%", up: false },
  { sym: "JPY/USD", price: "0.00635", change: "-0.43%", up: false },
];

export function TopBar() {
  const [time, setTime] = useState(new Date());
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <header
      className="flex items-center shrink-0 border-b border-border gap-0"
      style={{ height: 44, borderColor: "var(--border)", background: "var(--card)" }}
    >
      {/* Clock */}
      <div
        className="flex flex-col justify-center px-4 border-r border-border shrink-0"
        style={{ borderColor: "var(--border)", height: "100%", minWidth: 140 }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--foreground)", fontWeight: 500, lineHeight: 1 }}>
          {formatTime(time)}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", marginTop: 2, letterSpacing: "0.06em" }}>
          {formatDate(time)} EST
        </div>
      </div>

      {/* Ticker */}
      <div className="flex-1 overflow-hidden flex items-center" style={{ height: "100%" }}>
        <div className="flex items-center gap-6 px-4" style={{ overflowX: "auto", scrollbarWidth: "none", height: "100%" }}>
          {TICKERS.map((t) => (
            <div key={t.sym} className="flex items-center gap-2 shrink-0">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)", letterSpacing: "0.08em", fontWeight: 500 }}>
                {t.sym}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>
                {t.price}
              </span>
              <span
                className="flex items-center gap-0.5"
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: t.up ? "var(--positive)" : "var(--negative)", fontWeight: 500 }}
              >
                {t.up ? <ChevronUp size={10} strokeWidth={2.5} /> : <ChevronDown size={10} strokeWidth={2.5} />}
                {t.change}
              </span>
              <span style={{ width: 1, height: 16, background: "var(--border)", display: "inline-block" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 px-3 border-l border-border shrink-0" style={{ borderColor: "var(--border)", height: "100%" }}>
        <div
          className="flex items-center gap-2 rounded-sm px-3"
          style={{ background: "var(--secondary)", height: 28, border: "1px solid var(--border)" }}
        >
          <Search size={12} style={{ color: "var(--muted-foreground)" }} />
          <input
            placeholder="Search assets, sectors..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 11,
              color: "var(--foreground)",
              fontFamily: "var(--font-sans)",
              width: 160,
            }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted-foreground)", background: "var(--muted)", padding: "1px 4px", borderRadius: 2 }}>
            ⌘K
          </span>
        </div>
        <button
          className="flex items-center justify-center rounded-sm"
          style={{ width: 28, height: 28, color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
        >
          <Bell size={13} />
        </button>
      </div>
    </header>
  );
}
