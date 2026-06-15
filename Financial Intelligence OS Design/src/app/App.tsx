import "../styles/fonts.css";
import { useState } from "react";
import { Sidebar, type Section } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { CommandCenter } from "./components/CommandCenter";
import { AssetUniverse } from "./components/AssetUniverse";
import { SectorIntelligence } from "./components/SectorIntelligence";
import { CountryMonitor } from "./components/CountryMonitor";
import { OpportunityEngine } from "./components/OpportunityEngine";
import { ResearchVault } from "./components/ResearchVault";
import { CareerHub } from "./components/CareerHub";

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("command");

  const renderSection = () => {
    switch (activeSection) {
      case "command": return <CommandCenter />;
      case "assets": return <AssetUniverse />;
      case "sectors": return <SectorIntelligence />;
      case "countries": return <CountryMonitor />;
      case "opportunities": return <OpportunityEngine />;
      case "research": return <ResearchVault />;
      case "career": return <CareerHub />;
    }
  };

  return (
    <div className="size-full flex bg-background text-foreground overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>
      {/* MARKER-MAKE-KIT-INVOKED */}
      {/* MARKER-MAKE-KIT-DISCOVERY-READ */}
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
