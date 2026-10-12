"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Mail,
  MessageSquare,
  FileText,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Stethoscope,
  ShieldCheck,
  Pill,
  Activity,
  AlertCircle,
  Paperclip,
} from "lucide-react";

interface CoraMessageRendererProps {
  content: string;
  onActionClick?: (prompt: string) => void;
  onCopyToEvolution?: (text: string) => void;
}

interface ParsedAppointment {
  time: string;
  patient: string;
  reason: string;
  status: string;
  email: string;
}

interface ParsedConsultation {
  index: number;
  date: string;
  reason: string;
  findings: string;
  treatment: string;
}

interface ParsedDocument {
  category: string;
  name: string;
  fileType: string;
  date: string;
}

export function CoraMessageRenderer({
  content,
  onActionClick,
  onCopyToEvolution,
}: CoraMessageRendererProps) {
  const [copied, setCopied] = useState(false);

  // Limpiar etiquetas internas de depuración si existieran
  const cleanContent = content
    .replace(/^\[CORA\s*-\s*[^\]]+\]\s*/i, "")
    .replace(/\[CORA\s*-\s*[^\]]+\]/gi, "")
    .trim();

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopyToEvolution?.(text);
  };

  // Helper para generar iniciales de avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2) || "PA").toUpperCase();
  };

  // ==========================================
  // 1. DETECCIÓN Y PARSEO DE AGENDA / TURNOS
  // ==========================================
  const apptRegex =
    /^[•*]?\s*\[?(\d{1,2}:\d{2})\s*hs?\]?\s*(.+?)\s*(?:—|-)\s*Motivo:\s*(.+?)\s*\|\s*Estado:\s*(.+?)\s*\|\s*(?:Correo|Entrega):\s*(.+)$/i;

  const lines = cleanContent.split("\n");
  const appointmentLines: ParsedAppointment[] = [];
  const scheduleIntroLines: string[] = [];
  let scheduleDate = "";
  let scheduleQuestion = "";

  const isScheduleMessage =
    cleanContent.includes("CRONOGRAMA DE TURNOS") ||
    lines.some((l) => apptRegex.test(l.trim()));

  if (isScheduleMessage) {
    let readingAppointments = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const match = line.match(apptRegex);

      if (match) {
        readingAppointments = true;
        appointmentLines.push({
          time: match[1],
          patient: match[2].trim(),
          reason: match[3].trim(),
          status: match[4].trim(),
          email: match[5].trim(),
        });
      } else if (line.toUpperCase().includes("CRONOGRAMA DE TURNOS")) {
        readingAppointments = true;
        const dateMatch = line.match(/\((\d{2}[/-]\d{2}[/-]\d{4})\)/);
        if (dateMatch) {
          scheduleDate = dateMatch[1];
        }
      } else if (readingAppointments && (line.startsWith("¿") || line.includes("?"))) {
        scheduleQuestion = line;
      } else if (!readingAppointments && line.length > 0) {
        scheduleIntroLines.push(line);
      }
    }
  }

  // ==========================================
  // 2. DETECCIÓN Y PARSEO DE FICHA DEL PACIENTE
  // ==========================================
  const isPatientHistory =
    cleanContent.includes("FICHA DEL PACIENTE:") ||
    cleanContent.includes("Ficha del paciente:");

  let patientName = "";
  let patientDni = "";
  let patientInsurance = "";
  let patientAllergies = "";
  const patientConsultations: ParsedConsultation[] = [];
  let patientFooterNote = "";

  if (isPatientHistory) {
    const dniMatch = cleanContent.match(
      /FICHA DEL PACIENTE:\s*([^(]+)\s*(?:\(DNI:\s*([^)]+)\))?/i
    );
    if (dniMatch) {
      patientName = dniMatch[1].trim();
      patientDni = dniMatch[2]?.trim() || "";
    }

    const insMatch = cleanContent.match(/Cobertura:\s*([^\n]+)/i);
    if (insMatch) {
      patientInsurance = insMatch[1].trim();
    }

    const algMatch = cleanContent.match(/Alergias conocidas:\s*([^\n]+)/i);
    if (algMatch) {
      patientAllergies = algMatch[1].trim();
    }

    // Parsear consultas individuales
    // Ej: 1. [06/10/2026] Motivo: Seguimiento... \n Hallazgos: ... \n Tratamiento: ...
    const consultRegex =
      /(\d+)\.\s*\[([^\]]+)\]\s*Motivo:\s*([^\n]+)\s*\n\s*Hallazgos:\s*([^\n]+)\s*\n\s*Tratamiento:\s*([^\n]+)/gi;
    let matchC;
    while ((matchC = consultRegex.exec(cleanContent)) !== null) {
      patientConsultations.push({
        index: parseInt(matchC[1], 10),
        date: matchC[2].trim(),
        reason: matchC[3].trim(),
        findings: matchC[4].trim(),
        treatment: matchC[5].trim(),
      });
    }

    const noteMatch = cleanContent.match(/\*(?:Nota:)?\s*([^*]+)\*/i);
    if (noteMatch) {
      patientFooterNote = noteMatch[1].trim();
    }
  }

  // ==========================================
  // 3. DETECCIÓN DE BORRADOR DE EVOLUCIÓN
  // ==========================================
  const isClinicalDraft =
    cleanContent.includes("Borrador de Evolución") ||
    cleanContent.includes("Borrador de evolución") ||
    cleanContent.includes("Borrador Clínico") ||
    cleanContent.includes("Chief Complaint") ||
    cleanContent.includes("Diagnóstico Presuntivo");

  // ==========================================
  // 4. DETECCIÓN DE ESTUDIOS COMPLEMENTARIOS
  // ==========================================
  const isDocumentsList =
    cleanContent.includes("ESTUDIOS COMPLEMENTARIOS") ||
    cleanContent.includes("Estudios y Documentos Clínicos");

  const parsedDocuments: ParsedDocument[] = [];
  if (isDocumentsList) {
    const docRegex = /^[•*–-]?\s*\[([^\]]+)\]\s*(.+?)\s*\(([^)]+)\)\s*(?:·|-)\s*Subido el\s*([^\n]+)/gim;
    let matchD;
    while ((matchD = docRegex.exec(cleanContent)) !== null) {
      parsedDocuments.push({
        category: matchD[1].trim(),
        name: matchD[2].trim(),
        fileType: matchD[3].trim(),
        date: matchD[4].trim(),
      });
    }
  }

  // ==========================================
  // RENDERIZADO DE BADGES Y PILLS
  // ==========================================
  const renderStatusBadge = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes("en consulta") || lower.includes("in_consultation")) {
      return (
        <span
          style={{
            background: "#dcfce7",
            color: "#15803d",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#16a34a",
              boxShadow: "0 0 0 2px rgba(22,163,74,0.3)",
            }}
          />
          En consulta
        </span>
      );
    }
    if (lower.includes("confirmado") || lower.includes("confirmed")) {
      return (
        <span
          style={{
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <CheckCircle2 size={12} /> Confirmado
        </span>
      );
    }
    if (lower.includes("completado") || lower.includes("attended")) {
      return (
        <span
          style={{
            background: "#f0fdf4",
            color: "#166534",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Completado
        </span>
      );
    }
    return (
      <span
        style={{
          background: "#f1f5f9",
          color: "#475569",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        Programado
      </span>
    );
  };

  const renderDeliveryBadge = (email: string) => {
    const lower = email.toLowerCase();
    if (lower.includes("abierto") || lower.includes("opened")) {
      return (
        <span
          style={{
            background: "#ecfdf5",
            color: "#047857",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: 600,
          }}
        >
          <Mail size={11} /> Correo abierto ✓
        </span>
      );
    }
    if (lower.includes("entregado") || lower.includes("delivered")) {
      return (
        <span
          style={{
            background: "#f0fdfa",
            color: "#0f766e",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "11px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: 500,
          }}
        >
          <Mail size={11} /> Entregado
        </span>
      );
    }
    if (lower.includes("rebotó") || lower.includes("bounced")) {
      return (
        <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
          <span
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <AlertTriangle size={11} /> Rebotó
          </span>
          <span
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <MessageSquare size={11} /> WhatsApp ✓
          </span>
        </div>
      );
    }
    return (
      <span
        style={{
          background: "#f8fafc",
          color: "#64748b",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "11px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Mail size={11} /> Enviado
      </span>
    );
  };

  // ==========================================
  // CASO 1: WIDGET DE AGENDA Y TURNOS
  // ==========================================
  if (isScheduleMessage && appointmentLines.length > 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        {/* Línea introductoria limpia */}
        {scheduleIntroLines.length > 0 && (
          <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "var(--ink)" }}>
            {scheduleIntroLines.join(" ")}
          </p>
        )}

        {/* Tarjeta principal del Widget de Agenda */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          {/* Cabecera del Widget con Fecha */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
              paddingBottom: "10px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Calendar size={17} />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "var(--ink)", display: "block" }}>
                  Cronograma de Turnos del Día
                </strong>
                {scheduleDate && (
                  <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                    Fecha: {scheduleDate}
                  </span>
                )}
              </div>
            </div>
            <span
              style={{
                fontSize: "11px",
                background: "var(--surface-soft)",
                color: "var(--brand)",
                padding: "3px 10px",
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              {appointmentLines.length} turnos
            </span>
          </div>

          {/* Lista de Turnos estilizados */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {appointmentLines.map((appt, i) => {
              const initials = getInitials(appt.patient);

              return (
                <div
                  key={i}
                  style={{
                    background: "var(--canvas)",
                    border: "1px solid var(--line)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    transition: "all 0.15s ease",
                  }}
                >
                  {/* Fila superior: Hora, Avatar Paciente, Nombre y Estado */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          background: "var(--surface)",
                          color: "var(--brand)",
                          border: "1px solid var(--line-strong)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Clock size={12} /> {appt.time} hs
                      </span>

                      {/* Avatar circular con iniciales */}
                      <div
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          background: "var(--brand-soft)",
                          color: "var(--brand)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "10px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>

                      <strong style={{ fontSize: "13px", color: "var(--ink)" }}>
                        {appt.patient}
                      </strong>
                    </div>

                    {renderStatusBadge(appt.status)}
                  </div>

                  {/* Fila intermedia: Motivo de consulta */}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--ink-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      paddingLeft: "2px",
                    }}
                  >
                    <Stethoscope size={13} style={{ flexShrink: 0, color: "var(--brand)" }} />
                    <span>{appt.reason}</span>
                  </div>

                  {/* Fila inferior: Estado de entrega y botones de acción rápida */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "2px",
                      paddingTop: "6px",
                      borderTop: "1px dashed var(--line)",
                    }}
                  >
                    {renderDeliveryBadge(appt.email)}

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        style={{
                          background: "transparent",
                          border: "1px solid var(--line-strong)",
                          borderRadius: "6px",
                          color: "var(--brand)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          padding: "2px 8px",
                        }}
                        onClick={() => onActionClick?.(`Resumir antecedentes de ${appt.patient}`)}
                        title="Ver antecedentes clínicos"
                      >
                        <User size={11} /> Antecedentes
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "var(--brand-soft)",
                          border: 0,
                          borderRadius: "6px",
                          color: "var(--brand)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          padding: "2px 8px",
                        }}
                        onClick={() =>
                          onActionClick?.(`Prepara el borrador de evolución para ${appt.patient}`)
                        }
                        title="Redactar borrador de evolución"
                      >
                        <FileText size={11} /> Evolucionar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pregunta interactiva final en burbuja conversacional */}
        {scheduleQuestion && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--surface-soft)",
              borderRadius: "10px",
              border: "1px solid var(--line)",
              fontWeight: 600,
              color: "var(--brand)",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={15} style={{ flexShrink: 0 }} />
            <span>{scheduleQuestion}</span>
          </div>
        )}

        {/* Chips de acción rápida sugerida */}
        {onActionClick && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "2px" }}>
            <button
              type="button"
              className="secondary-button"
              style={{
                fontSize: "11px",
                minHeight: "30px",
                padding: "0 12px",
                borderRadius: "16px",
                width: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
              onClick={() => onActionClick("Prepara el borrador de evolución para el próximo turno")}
            >
              <Sparkles size={12} color="var(--brand)" /> Preparar borrador de evolución
            </button>
            {appointmentLines[0] && (
              <button
                type="button"
                className="secondary-button"
                style={{
                  fontSize: "11px",
                  minHeight: "30px",
                  padding: "0 12px",
                  borderRadius: "16px",
                  width: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={() =>
                  onActionClick(`Resumir antecedentes de ${appointmentLines[0].patient}`)
                }
              >
                <User size={12} color="var(--brand)" /> Antecedentes de {appointmentLines[0].patient}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // CASO 2: FICHA DEL PACIENTE Y ANTECEDENTES
  // ==========================================
  if (isPatientHistory && patientName) {
    const hasAllergies =
      patientAllergies &&
      !patientAllergies.toLowerCase().includes("sin alergias") &&
      !patientAllergies.toLowerCase().includes("ninguna");

    const initials = getInitials(patientName);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--ink)" }}>
          Resumen de antecedentes clínicos recuperados directamente de la base de datos de Medora:
        </p>

        {/* Tarjeta de Ficha de Paciente */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          {/* Cabecera del Paciente */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {initials}
              </div>
              <div>
                <strong style={{ fontSize: "15px", color: "var(--ink)", display: "block" }}>
                  {patientName}
                </strong>
                <div style={{ display: "flex", gap: "8px", marginTop: "2px", alignItems: "center" }}>
                  {patientDni && (
                    <span
                      style={{
                        fontSize: "11px",
                        background: "var(--canvas)",
                        color: "var(--ink-muted)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        border: "1px solid var(--line)",
                      }}
                    >
                      DNI: {patientDni}
                    </span>
                  )}
                  {patientInsurance && (
                    <span
                      style={{
                        fontSize: "11px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        fontWeight: 600,
                      }}
                    >
                      {patientInsurance}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: "11px",
                background: "var(--surface-soft)",
                color: "var(--brand)",
                padding: "3px 9px",
                borderRadius: "12px",
                fontWeight: 600,
              }}
            >
              Expediente digital
            </span>
          </div>

          {/* Banner de Alergias */}
          <div style={{ marginTop: "12px" }}>
            {hasAllergies ? (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#92400e",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <AlertTriangle size={15} color="#b45309" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Alergias conocidas:</strong> {patientAllergies}
                </span>
              </div>
            ) : (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#166534",
                  fontSize: "12px",
                }}
              >
                <ShieldCheck size={15} color="#15803d" style={{ flexShrink: 0 }} />
                <span>Sin alergias medicamentosas declaradas</span>
              </div>
            )}
          </div>

          {/* Sección de Consultas / Evoluciones Previas */}
          <div style={{ marginTop: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <strong style={{ fontSize: "12px", color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Historial de Consultas Recientes ({patientConsultations.length})
              </strong>
            </div>

            {patientConsultations.length === 0 ? (
              <div style={{ fontSize: "12px", color: "var(--ink-muted)", fontStyle: "italic" }}>
                Sin consultas clínicas previas registradas.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {patientConsultations.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "var(--canvas)",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            background: "var(--surface)",
                            border: "1px solid var(--line-strong)",
                            padding: "1px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "var(--brand)",
                          }}
                        >
                          {c.date}
                        </span>
                        <strong style={{ fontSize: "12px", color: "var(--ink)" }}>{c.reason}</strong>
                      </div>
                    </div>

                    <div style={{ fontSize: "12px", color: "var(--ink)", lineHeight: "1.4" }}>
                      <span style={{ color: "var(--ink-muted)" }}>Hallazgos: </span>
                      {c.findings}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#166534",
                        background: "#f0fdf4",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                        lineHeight: "1.4",
                      }}
                    >
                      <Pill size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong>Plan / Tratamiento: </strong>
                        {c.treatment}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nota al pie */}
          {patientFooterNote && (
            <div
              style={{
                marginTop: "12px",
                paddingTop: "8px",
                borderTop: "1px solid var(--line)",
                fontSize: "11px",
                color: "var(--ink-muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <CheckCircle2 size={12} color="var(--brand)" />
              <span>{patientFooterNote}</span>
            </div>
          )}
        </div>

        {/* Acciones sugeridas para el paciente */}
        {onActionClick && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "2px" }}>
            <button
              type="button"
              className="secondary-button"
              style={{
                fontSize: "11px",
                minHeight: "30px",
                padding: "0 12px",
                borderRadius: "16px",
                width: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
              onClick={() => onActionClick(`Prepara el borrador de evolución para ${patientName}`)}
            >
              <FileText size={12} color="var(--brand)" /> Redactar evolución para {patientName}
            </button>
            <button
              type="button"
              className="secondary-button"
              style={{
                fontSize: "11px",
                minHeight: "30px",
                padding: "0 12px",
                borderRadius: "16px",
                width: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
              onClick={() => onActionClick(`Estudios complementarios de ${patientName}`)}
            >
              <Paperclip size={12} color="var(--brand)" /> Ver estudios complementarios
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // CASO 3: BORRADOR DE EVOLUCIÓN CLÍNICA (SOAP)
  // ==========================================
  if (isClinicalDraft) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        <div
          style={{
            background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 4px 14px rgba(22, 101, 52, 0.06)",
          }}
        >
          {/* Cabecera del Borrador con Botón Copiar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "1px solid #dcfce7",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "#dcfce7",
                  color: "#15803d",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <strong style={{ fontSize: "14px", color: "#166534", display: "block" }}>
                  Borrador de Evolución Sugerida (SOAP)
                </strong>
                <span style={{ fontSize: "11px", color: "#15803d" }}>
                  Listo para firmar e insertar en expediente
                </span>
              </div>
            </div>
            <button
              type="button"
              className="primary-button"
              style={{
                fontSize: "11px",
                minHeight: "32px",
                padding: "0 12px",
                background: "#15803d",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                borderRadius: "8px",
              }}
              onClick={() => handleCopy(cleanContent)}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "¡Copiado!" : "Copiar a evolución"}
            </button>
          </div>

          {/* Contenido Clínico Estructurado */}
          <div
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: "var(--ink)",
              whiteSpace: "pre-wrap",
              background: "rgba(255,255,255,0.85)",
              padding: "14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            {cleanContent}
          </div>
        </div>

        {/* Botón flotante para insertar directamente */}
        {onCopyToEvolution && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="secondary-button"
              style={{
                fontSize: "11px",
                minHeight: "28px",
                padding: "0 10px",
                borderRadius: "14px",
                color: "var(--brand)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
              onClick={() => onCopyToEvolution(cleanContent)}
            >
              <ChevronRight size={13} /> Abrir directamente en formulario de notas
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // CASO 4: ESTUDIOS Y DOCUMENTOS CLÍNICOS
  // ==========================================
  if (isDocumentsList && parsedDocuments.length > 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "var(--brand-soft)",
                  color: "var(--brand)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Paperclip size={16} />
              </div>
              <strong style={{ fontSize: "14px", color: "var(--ink)" }}>
                Estudios y Documentos Adjuntos
              </strong>
            </div>
            <span
              style={{
                fontSize: "11px",
                background: "var(--surface-soft)",
                color: "var(--brand)",
                padding: "3px 9px",
                borderRadius: "12px",
                fontWeight: 700,
              }}
            >
              {parsedDocuments.length} encontrados
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {parsedDocuments.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--canvas)",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={18} color="var(--brand)" />
                  <div>
                    <strong style={{ fontSize: "13px", color: "var(--ink)", display: "block" }}>
                      {doc.name}
                    </strong>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "1px 5px",
                          borderRadius: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {doc.category}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                        {doc.fileType.toUpperCase()} · Subido el {doc.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASO 5: MENSAJE CONVERSACIONAL GENERAL
  // ==========================================
  const generalLines = cleanContent.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <div style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--ink)" }}>
        {generalLines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} style={{ height: "6px" }} />;

          // Títulos Markdown ###
          if (trimmed.startsWith("###")) {
            return (
              <h3
                key={idx}
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  margin: "8px 0 4px",
                }}
              >
                {trimmed.replace(/^###\s*/, "")}
              </h3>
            );
          }

          // Viñetas • o -
          if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                  margin: "3px 0",
                  paddingLeft: "4px",
                }}
              >
                <span style={{ color: "var(--brand)", marginTop: "1px" }}>•</span>
                <span>{trimmed.replace(/^[•*-]\s*/, "")}</span>
              </div>
            );
          }

          // Pregunta final interactiva
          if (trimmed.startsWith("¿") && trimmed.endsWith("?")) {
            return (
              <div
                key={idx}
                style={{
                  marginTop: "8px",
                  padding: "10px 14px",
                  background: "var(--surface-soft)",
                  borderRadius: "10px",
                  border: "1px solid var(--line)",
                  fontWeight: 600,
                  color: "var(--brand)",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Sparkles size={15} style={{ flexShrink: 0 }} />
                <span>{trimmed}</span>
              </div>
            );
          }

          return (
            <p key={idx} style={{ margin: "4px 0" }}>
              {trimmed}
            </p>
          );
        })}
      </div>
    </div>
  );
}
