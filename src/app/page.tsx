"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  Check,
  Stethoscope,
  ChevronRight,
  Pill,
  Paperclip,
  Database,
  Lock,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"agenda" | "paciente" | "soap">("agenda");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--canvas)",
        color: "var(--ink)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ==================================================== */}
      {/* 1. NAVBAR / HEADER SUPERIOR CON BOTÓN ARRIBA A LA DERECHA */}
      {/* ==================================================== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--line)",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--brand)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "16px",
              boxShadow: "0 2px 8px rgba(11,102,91,0.25)",
            }}
          >
            +
          </div>
          <div>
            <span
              style={{
                fontFamily: "Manrope, sans-serif",
                fontWeight: 800,
                fontSize: "20px",
                letterSpacing: "-0.5px",
                display: "block",
                lineHeight: "1",
              }}
            >
              Medora
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "var(--brand)",
                fontWeight: 700,
                letterSpacing: "0.8px",
              }}
            >
              CLINICAL SUITE
            </span>
          </div>
        </Link>

        {/* Enlaces de navegación central */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
          className="desktop-nav"
        >
          <a
            href="#cora-ai"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--ink-muted)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Sparkles size={13} color="var(--brand)" /> CORA AI Copilot
          </a>
          <a
            href="#funcionalidades"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--ink-muted)",
              textDecoration: "none",
            }}
          >
            Funcionalidades
          </a>
          <a
            href="#omnicanal"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--ink-muted)",
              textDecoration: "none",
            }}
          >
            WhatsApp & Correo
          </a>
          <a
            href="#credenciales"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--brand)",
              textDecoration: "none",
              background: "var(--brand-soft)",
              padding: "4px 10px",
              borderRadius: "12px",
            }}
          >
            ⚡ Credenciales Demo
          </a>
        </nav>

        {/* BOTÓN SUPERIOR DERECHA: REDIRECCIÓN AL LOGIN */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user ? (
            <Link
              href="/agenda"
              className="primary-button"
              style={{
                fontSize: "13px",
                padding: "0 18px",
                height: "42px",
                borderRadius: "10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
              }}
            >
              <span>Ir a mi Consultorio</span>
              <ArrowRight size={15} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="primary-button"
              style={{
                fontSize: "13px",
                padding: "0 20px",
                height: "42px",
                borderRadius: "10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(11,102,91,0.22)",
              }}
            >
              <User size={15} />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2. HERO SECTION */}
      {/* ==================================================== */}
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "60px 24px 50px",
          textAlign: "center",
        }}
      >
        {/* Badge Eyebrow */}
        <div style={{ display: "inline-flex", marginBottom: "18px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "var(--brand-soft)",
              color: "var(--brand)",
              padding: "5px 14px",
              borderRadius: "24px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.8px",
            }}
          >
            <Sparkles size={14} /> PLATAFORMA CLÍNICA MOBILE-FIRST PWA · CORA AI INTEGRADA
          </span>
        </div>

        {/* Título Principal */}
        <h1
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 800,
            lineHeight: "1.15",
            letterSpacing: "-1.5px",
            maxWidth: "960px",
            margin: "0 auto 20px",
            color: "var(--ink)",
          }}
        >
          La gestión de consultorio médico que entiende tu ritmo.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #0b665b 0%, #15803d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Potenciada por CORA AI.
          </span>
        </h1>

        {/* Subtítulo explicativo */}
        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: "1.6",
            color: "var(--ink-muted)",
            maxWidth: "780px",
            margin: "0 auto 34px",
          }}
        >
          Agenda reactiva en tiempo real, expedientes con fotos de estudios, confirmaciones
          omnicanal por WhatsApp y Correo, y <strong>CORA</strong>: tu copiloto clínico con Google
          Gemini que audita turnos y redacta evoluciones SOAP al instante.
        </p>

        {/* Botones de llamada a la acción (CTA) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: "38px",
          }}
        >
          <Link
            href="/login"
            className="primary-button"
            style={{
              fontSize: "15px",
              height: "48px",
              padding: "0 28px",
              borderRadius: "12px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>Ingresar con Cuenta de Prueba</span>
            <ArrowRight size={17} />
          </Link>

          <a
            href="#cora-ai"
            className="secondary-button"
            style={{
              fontSize: "14px",
              height: "48px",
              padding: "0 22px",
              borderRadius: "12px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--surface)",
              border: "1px solid var(--line-strong)",
              color: "var(--brand)",
            }}
          >
            <Sparkles size={16} /> Ver cómo funciona CORA AI
          </a>
        </div>

        {/* Métricas y Garantías */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "28px",
            flexWrap: "wrap",
            fontSize: "12px",
            color: "var(--ink-muted)",
            fontWeight: 600,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="var(--brand)" /> 100% Mobile-First PWA instalable
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="var(--brand)" /> Sincronización Server-Sent Events (SSE)
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="var(--brand)" /> IA con Gemini Flash 3.8 en español
          </span>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. VISTA PREVIA INTERACTIVA DE CORA AI COPILOT */}
      {/* ==================================================== */}
      <section
        id="cora-ai"
        style={{
          maxWidth: "1160px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f9fbfb 100%)",
            border: "1px solid var(--line)",
            borderRadius: "24px",
            padding: "36px 32px",
            boxShadow: "0 16px 50px rgba(18, 48, 45, 0.06)",
          }}
        >
          {/* Cabecera del Showcase */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#dcfce7",
                color: "#15803d",
                padding: "3px 12px",
                borderRadius: "16px",
                fontSize: "11px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              <Sparkles size={13} /> COPILOTO CLÍNICO INTEGRADO
            </div>
            <h2
              style={{
                fontSize: "26px",
                fontFamily: "Manrope, sans-serif",
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              Conoce a CORA: Tu asistente de guardia 24/7
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--ink-muted)",
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              Haz clic en cualquiera de las consultas médicas de prueba para ver cómo CORA
              recupera datos reales de MongoDB y los renderiza en tarjetas de alta legibilidad:
            </p>
          </div>

          {/* Selector de pestañas interactivas */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab("agenda")}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: activeTab === "agenda" ? "2px solid var(--brand)" : "1px solid var(--line)",
                background: activeTab === "agenda" ? "var(--brand-soft)" : "var(--surface)",
                color: activeTab === "agenda" ? "var(--brand)" : "var(--ink)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <Calendar size={16} /> 1. ¿Qué turnos tengo hoy?
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("paciente")}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: activeTab === "paciente" ? "2px solid var(--brand)" : "1px solid var(--line)",
                background: activeTab === "paciente" ? "var(--brand-soft)" : "var(--surface)",
                color: activeTab === "paciente" ? "var(--brand)" : "var(--ink)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <User size={16} /> 2. Antecedentes de Mariana López
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("soap")}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: activeTab === "soap" ? "2px solid #15803d" : "1px solid var(--line)",
                background: activeTab === "soap" ? "#dcfce7" : "var(--surface)",
                color: activeTab === "soap" ? "#15803d" : "var(--ink)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <FileText size={16} /> 3. Borrador de Evolución SOAP
            </button>
          </div>

          {/* Renderizado de la demostración seleccionada */}
          <div
            style={{
              background: "var(--canvas)",
              borderRadius: "16px",
              border: "1px solid var(--line)",
              padding: "24px",
              maxWidth: "720px",
              margin: "0 auto",
            }}
          >
            {/* 1. DEMO AGENDA */}
            {activeTab === "agenda" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--ink)" }}>
                  He consultado la agenda del consultorio directamente en la base de datos de Medora:
                </p>

                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "14px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid var(--line)",
                      paddingBottom: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={18} color="var(--brand)" />
                      <strong style={{ fontSize: "14px" }}>Cronograma de Turnos del Día</strong>
                    </div>
                    <span
                      style={{
                        background: "var(--brand-soft)",
                        color: "var(--brand)",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      5 turnos
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {/* Item 1 */}
                    <div
                      style={{
                        background: "var(--canvas)",
                        border: "1px solid var(--line)",
                        borderRadius: "10px",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              background: "var(--surface)",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "var(--brand)",
                              border: "1px solid var(--line-strong)",
                            }}
                          >
                            12:00 hs
                          </span>
                          <strong style={{ fontSize: "13px" }}>Sofía Ramírez</strong>
                        </div>
                        <span
                          style={{
                            background: "#dcfce7",
                            color: "#15803d",
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          ● En consulta
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--ink-muted)",
                          marginTop: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Stethoscope size={13} color="var(--brand)" />
                        Control general y chequeo anual
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#047857",
                          marginTop: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Mail size={12} /> Correo abierto ✓
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div
                      style={{
                        background: "var(--canvas)",
                        border: "1px solid var(--line)",
                        borderRadius: "10px",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              background: "var(--surface)",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "var(--brand)",
                              border: "1px solid var(--line-strong)",
                            }}
                          >
                            13:00 hs
                          </span>
                          <strong style={{ fontSize: "13px" }}>Mariana López</strong>
                        </div>
                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                          }}
                        >
                          ✓ Confirmado
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--ink-muted)",
                          marginTop: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Stethoscope size={13} color="var(--brand)" />
                        Seguimiento de tratamiento antihipertensivo
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#0f766e",
                          marginTop: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Mail size={12} /> Entregado ✓
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "var(--surface-soft)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--brand)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Sparkles size={14} /> ¿Deseas que prepare el borrador de evolución para el próximo
                  turno?
                </div>
              </div>
            )}

            {/* 2. DEMO PACIENTE */}
            {activeTab === "paciente" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--ink)" }}>
                  Resumen de antecedentes clínicos recuperados directamente del expediente:
                </p>

                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "14px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid var(--line)",
                      paddingBottom: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: "var(--brand-soft)",
                          color: "var(--brand)",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      >
                        ML
                      </div>
                      <div>
                        <strong style={{ fontSize: "14px", display: "block" }}>
                          Mariana López
                        </strong>
                        <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                          DNI: 34567890 · OSDE 310
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                      }}
                    >
                      Expediente Digital
                    </span>
                  </div>

                  {/* Alerta de Alergia */}
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      color: "#92400e",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    <AlertTriangle size={15} color="#b45309" />
                    <span>Alergias conocidas: Rinitis alérgica</span>
                  </div>

                  {/* Consulta Previa */}
                  <div
                    style={{
                      background: "var(--canvas)",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
                      <span
                        style={{
                          background: "var(--surface)",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "var(--brand)",
                        }}
                      >
                        06/10/2026
                      </span>
                      <strong>Motivo: Seguimiento de hipertensión arterial</strong>
                    </div>
                    <div style={{ color: "var(--ink-muted)", margin: "4px 0" }}>
                      Hallazgos: TA 135/85 mmHg en consultorio. Buena tolerancia al tratamiento habitual.
                    </div>
                    <div
                      style={{
                        color: "#166534",
                        background: "#f0fdf4",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "4px",
                      }}
                    >
                      <Pill size={12} /> Continuar con Enalapril 10mg diario. Control en 3 meses.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DEMO SOAP */}
            {activeTab === "soap" && (
              <div
                style={{
                  background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
                  border: "1px solid #bbf7d0",
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #dcfce7",
                    paddingBottom: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} color="#15803d" />
                    <div>
                      <strong style={{ fontSize: "14px", color: "#166534", display: "block" }}>
                        Borrador de Evolución Sugerida (SOAP)
                      </strong>
                      <span style={{ fontSize: "11px", color: "#15803d" }}>
                        Estructurado con CIE-10 y prescripción farmacológica
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      background: "#15803d",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    Listo para firmar
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.6",
                    color: "var(--ink)",
                    background: "#fff",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: "0 0 6px" }}>
                    • <strong>Motivo (Chief Complaint):</strong> Odinofagia aguda 72 hs con febrícula (37.8°C).
                  </p>
                  <p style={{ margin: "0 0 6px" }}>
                    • <strong>Hallazgos (Notes):</strong> Fauces congestivas con exudado blanquecino pultáceo bilateral.
                  </p>
                  <p style={{ margin: "0 0 6px" }}>
                    • <strong>Diagnóstico:</strong> Faringoamigdalitis aguda bacteriana (CIE-10: J03.9).
                  </p>
                  <p style={{ margin: 0 }}>
                    • <strong>Tratamiento:</strong> Amoxicilina 500 mg cada 8 hs x 7 días + Ibuprofeno 400 mg según dolor.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. FUNCIONALIDADES CLAVE DEL CONSULTORIO */}
      {/* ==================================================== */}
      <section
        id="funcionalidades"
        style={{
          maxWidth: "1200px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              color: "var(--brand)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
            }}
          >
            EXPERIENCIA INTEGRAL
          </span>
          <h2 style={{ fontSize: "30px", fontFamily: "Manrope, sans-serif", margin: 0 }}>
            Todo lo que tu consultorio necesita en una sola PWA
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "var(--brand-soft)",
                color: "var(--brand)",
                display: "grid",
                placeItems: "center",
                marginBottom: "16px",
              }}
            >
              <Calendar size={20} />
            </div>
            <h3 style={{ fontSize: "17px", margin: "0 0 8px" }}>Agenda Reactiva SSE</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-muted)", lineHeight: "1.6", margin: 0 }}>
              Control de citas en vivo con Server-Sent Events. Si un turno cambia de estado o se
              confirma, la pantalla se actualiza al instante sin recargas manuales.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#eff6ff",
                color: "#1d4ed8",
                display: "grid",
                placeItems: "center",
                marginBottom: "16px",
              }}
            >
              <FileText size={20} />
            </div>
            <h3 style={{ fontSize: "17px", margin: "0 0 8px" }}>Expediente Digital & Fotos</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-muted)", lineHeight: "1.6", margin: 0 }}>
              Notas clínicas cronológicas y captura instantánea de análisis de laboratorio y estudios
              por imágenes usando directamente la cámara del celular.
            </p>
          </div>

          {/* Card 3 */}
          <div
            id="omnicanal"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#f0fdf4",
                color: "#15803d",
                display: "grid",
                placeItems: "center",
                marginBottom: "16px",
              }}
            >
              <MessageSquare size={20} />
            </div>
            <h3 style={{ fontSize: "17px", margin: "0 0 8px" }}>WhatsApp + Resend Fallback</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-muted)", lineHeight: "1.6", margin: 0 }}>
              Trazabilidad de confirmación: si el correo electrónico rebota, Medora dispara de forma
              automática un recordatorio por WhatsApp para evitar ausentismo de pacientes.
            </p>
          </div>

          {/* Card 4 */}
          <div
            id="seguridad"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#fef3c7",
                color: "#b45309",
                display: "grid",
                placeItems: "center",
                marginBottom: "16px",
              }}
            >
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: "17px", margin: "0 0 8px" }}>Seguridad y Secreto Médico</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-muted)", lineHeight: "1.6", margin: 0 }}>
              Cifrado extremo a extremo, cookies HTTP-only para autenticación médica y cumplimiento de
              normativas de confidencialidad para datos de salud.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. SECCIÓN DE CREDENCIALES DE PRUEBA */}
      {/* ==================================================== */}
      <section
        id="credenciales"
        style={{
          maxWidth: "1000px",
          margin: "0 auto 80px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, var(--navy) 0%, #0d2830 100%)",
            color: "#fff",
            borderRadius: "24px",
            padding: "44px 36px",
            boxShadow: "0 20px 60px rgba(24,59,70,0.25)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(143,211,190,0.18)",
              color: "#8ed0be",
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "14px",
            }}
          >
            ⚡ ACCESO INMEDIATO SIN CONFIGURACIÓN
          </span>

          <h2
            style={{
              fontSize: "30px",
              fontFamily: "Manrope, sans-serif",
              color: "#fff",
              margin: "0 0 12px",
            }}
          >
            Cuentas de Médico Listas para Probar
          </h2>

          <p
            style={{
              fontSize: "15px",
              color: "#b8cbcb",
              maxWidth: "640px",
              margin: "0 auto 30px",
              lineHeight: "1.6",
            }}
          >
            Puedes ingresar directamente a la aplicación con cualquiera de los siguientes usuarios
            de prueba y explorar la agenda, los pacientes y las consultas con CORA AI:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
              maxWidth: "760px",
              margin: "0 auto 32px",
              textAlign: "left",
            }}
          >
            {/* Médico 1 */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#8ed0be",
                    color: "var(--navy)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                >
                  EV
                </div>
                <div>
                  <strong style={{ fontSize: "14px", color: "#fff", display: "block" }}>
                    Dra. Elena Vargas
                  </strong>
                  <span style={{ fontSize: "11px", color: "#8ed0be" }}>
                    Medicina General · MN 145.892
                  </span>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#d1dedd", marginTop: "10px" }}>
                <div>Email: <code style={{ color: "#fff", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>elena.vargas@medora-app.com</code></div>
                <div style={{ marginTop: "4px" }}>Password: <code style={{ color: "#fff", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>password123</code></div>
              </div>
            </div>

            {/* Médico 2 */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#93c5fd",
                    color: "var(--navy)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                >
                  CM
                </div>
                <div>
                  <strong style={{ fontSize: "14px", color: "#fff", display: "block" }}>
                    Dr. Carlos Mendoza
                  </strong>
                  <span style={{ fontSize: "11px", color: "#93c5fd" }}>
                    Cardiología · MN 168.420
                  </span>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#d1dedd", marginTop: "10px" }}>
                <div>Email: <code style={{ color: "#fff", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>carlos.mendoza@medora-app.com</code></div>
                <div style={{ marginTop: "4px" }}>Password: <code style={{ color: "#fff", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>password123</code></div>
              </div>
            </div>
          </div>

          <Link
            href="/login"
            style={{
              background: "#8ed0be",
              color: "var(--navy)",
              fontWeight: 800,
              fontSize: "15px",
              padding: "14px 32px",
              borderRadius: "12px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 6px 20px rgba(142,208,190,0.3)",
            }}
          >
            <span>Ir a la Pantalla de Login</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. FOOTER */}
      {/* ==================================================== */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          background: "var(--surface)",
          padding: "40px 32px 30px",
          fontSize: "12px",
          color: "var(--ink-muted)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--brand)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "12px",
              }}
            >
              +
            </div>
            <strong>Medora Healthcare Solutions</strong>
            <span>— Software de gestión médica y copiloto CORA AI</span>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/login" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>
              Iniciar Sesión
            </Link>
            <a href="#cora-ai" style={{ color: "var(--ink-muted)", textDecoration: "none" }}>
              CORA AI
            </a>
            <a href="#funcionalidades" style={{ color: "var(--ink-muted)", textDecoration: "none" }}>
              Funcionalidades
            </a>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "24px auto 0",
            paddingTop: "16px",
            borderTop: "1px dashed var(--line)",
            textAlign: "center",
            fontSize: "11px",
            color: "var(--ink-faint)",
          }}
        >
          Aviso legal: Medora y el asistente CORA AI actúan como soporte de gestión clínica y documental. Todas las decisiones diagnósticas y prescripciones son responsabilidad exclusiva del profesional de la salud matriculado.
        </div>
      </footer>
    </div>
  );
}
