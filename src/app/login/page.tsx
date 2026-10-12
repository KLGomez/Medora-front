"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDemoUser, setSelectedDemoUser] = useState<string | null>(null);

  const demoAccounts = [
    {
      id: "elena",
      name: "Dra. Elena Vargas",
      specialty: "Medicina General",
      license: "MN 145.892",
      email: "elena.vargas@medora-app.com",
      password: "password123",
      avatarColor: "#0b665b",
      avatarBg: "#d8ebe6",
      initials: "EV",
      notesCount: "5 turnos hoy · Base activa",
    },
    {
      id: "carlos",
      name: "Dr. Carlos Mendoza",
      specialty: "Cardiología",
      license: "MN 168.420",
      email: "carlos.mendoza@medora-app.com",
      password: "password123",
      avatarColor: "#1d4ed8",
      avatarBg: "#dbeafe",
      initials: "CM",
      notesCount: "Consultorio 2 · Turnos agendados",
    },
  ];

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    if (!targetEmail.trim() || !targetPass.trim()) {
      setErrorMsg("Por favor ingresa correo y contraseña.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await login(targetEmail, targetPass);
      router.push("/agenda");
    } catch (err: any) {
      console.error("Error en login:", err);
      setErrorMsg(
        err.message || "Credenciales inválidas. Verifica tu correo y contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demo: typeof demoAccounts[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setSelectedDemoUser(demo.id);
    handleLogin(undefined, demo.email, demo.password);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #eef6f4 0%, #f5f7f6 60%, #e8efed 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Barra superior de navegación */}
      <header
        style={{
          height: "68px",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--line)",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
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
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--brand)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "14px",
            }}
          >
            +
          </div>
          <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: "19px" }}>
            Medora
          </span>
        </Link>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--ink-muted)",
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: "8px",
            transition: "all 0.15s ease",
          }}
        >
          <ArrowLeft size={15} /> Volver a la presentación
        </Link>
      </header>

      {/* Contenedor central */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 18px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            background: "var(--surface)",
            borderRadius: "20px",
            border: "1px solid var(--line)",
            boxShadow: "0 10px 40px rgba(18, 48, 45, 0.08)",
            padding: "36px 32px",
          }}
        >
          {/* Encabezado del Formulario */}
          <div style={{ textAlign: "center", marginBottom: "26px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "var(--brand-soft)",
                color: "var(--brand)",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              <ShieldCheck size={12} /> ACCESO MÉDICO AUTORIZADO
            </span>
            <h1 style={{ fontSize: "24px", color: "var(--ink)", margin: "0 0 6px" }}>
              Iniciar Sesión en Medora
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--ink-muted)" }}>
              Ingresa al consultorio digital y asistente clínico CORA AI
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#b91c1c",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bloque Destacado de Credenciales de Prueba */}
          <div
            style={{
              background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)",
              border: "1px solid #bbf7d0",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={15} color="#15803d" />
                <strong style={{ fontSize: "12px", color: "#166534" }}>
                  Credenciales de Prueba (Acceso con 1 clic)
                </strong>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#15803d",
                  background: "#dcfce7",
                  padding: "1px 7px",
                  borderRadius: "10px",
                }}
              >
                Demo
              </span>
            </div>

            <p style={{ margin: "0 0 12px", fontSize: "12px", color: "var(--ink-muted)" }}>
              Selecciona una cuenta de médico para probar la agenda, expedientes y el copiloto clínico CORA con datos reales:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {demoAccounts.map((demo) => {
                const isSelected = selectedDemoUser === demo.id;

                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleSelectDemo(demo)}
                    disabled={loading}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: isSelected ? "#dcfce7" : "var(--surface)",
                      border: isSelected ? "2px solid #15803d" : "1px solid var(--line)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: demo.avatarBg,
                          color: demo.avatarColor,
                          display: "grid",
                          placeItems: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {demo.initials}
                      </div>
                      <div>
                        <strong style={{ fontSize: "13px", color: "var(--ink)", display: "block" }}>
                          {demo.name}
                        </strong>
                        <div style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                          {demo.specialty} · {demo.license}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: isSelected ? "#15803d" : "var(--brand)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        Ingresar <ArrowRight size={13} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                marginTop: "10px",
                paddingTop: "8px",
                borderTop: "1px dashed #cbd5e1",
                fontSize: "11px",
                color: "var(--ink-muted)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Contraseña para ambas cuentas: <strong style={{ color: "var(--ink)" }}>password123</strong></span>
              <UserCheck size={14} color="#15803d" />
            </div>
          </div>

          {/* Separador */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "20px 0",
              color: "var(--ink-faint)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
            <span>o ingresa manualmente</span>
            <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
          </div>

          {/* Formulario Manual */}
          <form onSubmit={(e) => handleLogin(e)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                Correo Electrónico
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    color: "var(--ink-faint)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="ej. elena.vargas@medora-app.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 12px 0 38px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "var(--canvas)",
                    fontSize: "13px",
                    color: "var(--ink)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginBottom: "6px",
                }}
              >
                Contraseña
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    color: "var(--ink-faint)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 40px 0 38px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "var(--canvas)",
                    fontSize: "13px",
                    color: "var(--ink)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "transparent",
                    border: 0,
                    color: "var(--ink-muted)",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                  }}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button"
              style={{
                width: "100%",
                height: "46px",
                fontSize: "14px",
                borderRadius: "10px",
                marginTop: "6px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión en el Consultorio</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Pie del modal */}
          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              fontSize: "12px",
              color: "var(--ink-muted)",
            }}
          >
            <span>¿Necesitas ayuda técnica? Contacto: </span>
            <strong style={{ color: "var(--brand)" }}>soporte@medora-app.com</strong>
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: "16px 20px",
          textAlign: "center",
          fontSize: "11px",
          color: "var(--ink-muted)",
          borderTop: "1px solid var(--line)",
        }}
      >
        Medora Healthcare Suite © 2026 · Cumplimiento de estándares de confidencialidad médica
      </footer>
    </div>
  );
}
