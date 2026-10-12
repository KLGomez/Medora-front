"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../ui/Icon";
import { CoraMessageRenderer } from "./CoraMessageRenderer";
import { api } from "@/lib/api";

interface CoraMessage {
  role: "user" | "assistant";
  content: string;
}

interface CoraSheetProps {
  isOpen: boolean;
  onClose: () => void;
  patientContextId?: string;
  onCopyToEvolution?: (text: string) => void;
}

export function CoraSheet({
  isOpen,
  onClose,
  patientContextId,
  onCopyToEvolution,
}: CoraSheetProps) {
  const [messages, setMessages] = useState<CoraMessage[]>([
    {
      role: "assistant",
      content:
        "Hola, Dra. Elena. Soy CORA, tu copiloto clínico potenciado por Google Gemini.\n\nPuedo auditar los turnos de hoy, resumir antecedentes de tus pacientes directamente de la base de datos o ayudarte a redactar evoluciones clínicas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: CoraMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.cora.chat(text, patientContextId);
      const reply = res?.content || "No se obtuvo respuesta del copiloto clínico.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("Error consultando a CORA:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Hubo un inconveniente al consultar el copiloto: ${err.message || "Error de conexión"}. Por favor verifica que el microservicio CORA esté activo.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const actionChips = [
    "¿Qué turnos tengo hoy?",
    "Antecedentes de Mariana López",
    "Historia clínica de Carlos Benítez",
    "Borrador de evolución para faringitis aguda",
  ];

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="modal"
        style={{
          maxWidth: "640px",
          height: "88vh",
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px",
          background: "var(--canvas)",
        }}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Sheet */}
        <div
          className="modal-head"
          style={{
            marginBottom: "12px",
            paddingBottom: "12px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "var(--brand-soft)",
                color: "var(--brand)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="sparkles" size={20} />
            </span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <p className="eyebrow" style={{ margin: 0, fontSize: "10px" }}>COPILOTO CLÍNICO</p>
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "10px",
                  }}
                >
                  Gemini Flash 3.8
                </span>
              </div>
              <h2 style={{ fontSize: "17px", margin: "2px 0 0" }}>CORA AI</h2>
            </div>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Lista de Mensajes con scroll */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            paddingRight: "6px",
            paddingBottom: "8px",
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                width: m.role === "user" ? "auto" : "100%",
                maxWidth: m.role === "user" ? "82%" : "100%",
              }}
            >
              {m.role === "user" ? (
                <div
                  style={{
                    background: "var(--brand)",
                    color: "#fff",
                    padding: "11px 16px",
                    borderRadius: "16px 16px 4px 16px",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    boxShadow: "0 2px 8px rgba(11,102,91,0.2)",
                  }}
                >
                  {m.content}
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    padding: "14px 16px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                  }}
                >
                  {/* Etiqueta del remitente CORA */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "10px",
                      color: "var(--brand)",
                    }}
                  >
                    <Icon name="sparkles" size={14} />
                    <strong style={{ fontSize: "11px", letterSpacing: "0.4px" }}>
                      CORA COPILOT
                    </strong>
                  </div>

                  <CoraMessageRenderer
                    content={m.content}
                    onActionClick={(prompt) => handleSend(prompt)}
                    onCopyToEvolution={onCopyToEvolution}
                  />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                padding: "12px 16px",
                borderRadius: "14px",
                fontSize: "12px",
                color: "var(--brand)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  border: "2px solid var(--brand)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Consultando expedientes en MongoDB con Gemini...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chips sugeridos */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            overflowX: "auto",
            padding: "8px 0",
            borderTop: "1px solid var(--line)",
            marginTop: "6px",
          }}
        >
          {actionChips.map((chip, idx) => (
            <button
              key={idx}
              style={{
                whiteSpace: "nowrap",
                fontSize: "11px",
                padding: "6px 12px",
                borderRadius: "16px",
                border: "1px solid var(--line-strong)",
                background: "var(--surface)",
                color: "var(--brand)",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.15s ease",
              }}
              onClick={() => handleSend(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "4px",
          }}
        >
          <input
            style={{
              flex: 1,
              height: "44px",
              padding: "0 14px",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              background: "var(--surface)",
              outline: "none",
            }}
            placeholder="Pregunta a CORA sobre pacientes, antecedentes o turnos..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="primary-button"
            disabled={isLoading || !input.trim()}
            style={{ minHeight: "44px", padding: "0 18px" }}
          >
            <Icon name="arrow" size={17} />
          </button>
        </form>
      </aside>
    </div>
  );
}
