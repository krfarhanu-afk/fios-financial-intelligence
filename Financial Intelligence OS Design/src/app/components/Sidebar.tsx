import {
  Home, LayoutGrid, BarChart2, Globe, Target, BookOpen, Briefcase, Settings, TrendingUp, Zap
} from "lucide-react";

export type Section =
  | "command"
  | "assets"
  | "sectors"
  | "countries"
  | "opportunities"
  | "research"
  | "career";

const navItems: { id: Section; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "command", label: "Command Center", icon: Home },
  { id: "assets", label: "Asset Universe", icon: LayoutGrid },
  { id: "sectors", label: "Sector Intel", icon: BarChart2 },
  { id: "countries", label: "Country Monitor", icon: Globe },
  { id: "opportunities", label: "Opportunities", icon: Target, badge: "7" },
  { id: "research", label: "Research Vault", icon: BookOpen },
  { id: "career", label: "Career Hub", icon: Briefcase },
];

interface SidebarProps {
  activeSection: Section;
  onNavigate: (s: Section) => void;
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside
      className="flex flex-col shrink-0 border-r border-border overflow-y-auto"
      style={{ width: 196, background: "var(--sidebar)", borderColor: "var(--sidebar-border)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center justify-center rounded-sm size-7"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          <Zap size={14} strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: 13, letterSpacing: "0.12em", color: "var(--foreground)", fontWeight: 600 }}>
            FIOS
          </div>
          <div style={{ fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>
            INTELLIGENCE OS
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2">
        <div style={{ fontSize: 9, color: "var(--muted-foreground)", letterSpacing: "0.12em", padding: "6px 8px 4px", fontFamily: "var(--font-mono)" }}>
          LAYERS
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-2.5 w-full text-left rounded-sm transition-colors"
              style={{
                padding: "7px 8px",
                background: active ? "var(--sidebar-accent)" : "transparent",
                color: active ? "var(--primary)" : "var(--sidebar-foreground)",
                fontSize: 12,
                fontWeight: active ? 500 : 400,
                borderLeft: active ? `2px solid var(--primary)` : "2px solid transparent",
              }}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className="rounded-sm px-1"
                  style={{
                    fontSize: 9,
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-border pt-3" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="rounded-sm px-3 py-2 mb-2" style={{ background: "var(--muted)", fontSize: 10 }}>
          <div style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>MARKET STATUS</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="size-1.5 rounded-full inline-block" style={{ background: "var(--positive)" }} />
            <span style={{ color: "var(--positive)", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500 }}>NYSE OPEN</span>
          </div>
        </div>
        <button
          className="flex items-center gap-2 w-full text-left rounded-sm transition-colors"
          style={{ padding: "7px 8px", color: "var(--muted-foreground)", fontSize: 12 }}
        >
          <Settings size={14} strokeWidth={1.5} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
