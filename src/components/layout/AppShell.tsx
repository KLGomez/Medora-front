"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { CoraSheet } from "../cora/CoraSheet";
import { NewAppointmentModal } from "../agenda/NewAppointmentModal";
import { NewNoteModal } from "../records/NewNoteModal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showCora, setShowCora] = useState(false);
  const [evolutionDraft, setEvolutionDraft] = useState<string | null>(null);

  const isPublicPage = pathname === "/" || pathname === "/landing" || pathname === "/login";

  if (isPublicPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-shell">
        <Header
          onNewAppointment={() => setShowAppointmentModal(true)}
          onOpenCora={() => setShowCora(true)}
        />
        {children}
      </div>
      <MobileNav />

      {/* Floating button for CORA on mobile */}
      <button
        style={{
          position: "fixed",
          left: "20px",
          bottom: "84px",
          zIndex: 35,
          width: "48px",
          height: "48px",
          display: "grid",
          placeItems: "center",
          border: 0,
          borderRadius: "50%",
          color: "#fff",
          background: "var(--navy)",
          boxShadow: "0 6px 20px rgba(24,59,70,0.3)",
          cursor: "pointer",
        }}
        onClick={() => setShowCora(true)}
        aria-label="Abrir CORA Copiloto"
        title="CORA Copiloto Clínico"
      >
        <span style={{ color: "#8ed0be", fontSize: "20px" }}>✦</span>
      </button>

      {showAppointmentModal && (
        <NewAppointmentModal onClose={() => setShowAppointmentModal(false)} />
      )}

      {evolutionDraft && (
        <NewNoteModal
          initialText={evolutionDraft}
          onClose={() => setEvolutionDraft(null)}
        />
      )}

      <CoraSheet
        isOpen={showCora}
        onClose={() => setShowCora(false)}
        onCopyToEvolution={(text) => {
          setShowCora(false);
          setEvolutionDraft(text);
        }}
      />
    </div>
  );
}
