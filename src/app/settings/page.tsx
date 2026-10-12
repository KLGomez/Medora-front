"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const { user, logout, login } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Consulta de estado de WhatsApp desde el backend
  const { data: whatsappStatus } = useQuery({
    queryKey: ["whatsapp-status"],
    queryFn: () => api.whatsapp.getStatus().catch(() => ({ connected: false })),
  });

  const whatsappConnected = !!whatsappStatus?.connected;

  const handleTogglePush = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushEnabled(true);
      }
    } else {
      setPushEnabled(!pushEnabled);
    }
  };

  const doctorName = user?.fullName || "Dra. Elena Vargas";
  const doctorSpecialty = user?.specialty || "Medicina General";
  const doctorLicense = user?.medicalLicense || "MN 145.892";
  const doctorEmail = user?.email || "elena.vargas@medora-app.com";
  const initials = doctorName
    .replace(/^Dr\.\s+|^Dra\.\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "EV";

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CONFIGURACIÓN DEL SISTEMA</p>
          <h1>Ajustes de Consultorio</h1>
          <p className="subtitle">Integraciones multicanal, notificaciones push y perfil médico.</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "24px", maxWidth: "800px" }}>
        {/* Perfil del médico */}
        <section className="schedule" style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <Avatar initials={initials} tone="navy" />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "16px" }}>{doctorName}</h2>
            <p className="subtitle" style={{ fontSize: "12px", margin: "2px 0 0" }}>
              {doctorSpecialty} · Matrícula {doctorLicense}
            </p>
            <span style={{ fontSize: "11px", color: "var(--brand)", fontWeight: 600 }}>
              {doctorEmail}
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {user ? (
              <button
                className="secondary-button"
                style={{ width: "auto" }}
                onClick={() => logout()}
              >
                Cerrar sesión
              </button>
            ) : (
              <button
                className="primary-button"
                style={{ width: "auto" }}
                onClick={() => login("elena.vargas@medora-app.com", "password123")}
              >
                Ingresar (Demo)
              </button>
            )}
          </div>
        </section>

        {/* Notificaciones Web Push (VAPID) */}
        <section className="schedule">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon name="bell" size={18} />
                <h2 style={{ fontSize: "15px" }}>Notificaciones Web Push (VAPID)</h2>
              </div>
              <p className="subtitle" style={{ fontSize: "12px", margin: "6px 0 0" }}>
                Recibe alertas táctiles directas en tu teléfono si un correo de turno rebota o un paciente cancela.
              </p>
            </div>
            <button
              className={pushEnabled ? "secondary-button" : "primary-button"}
              style={{ width: "auto" }}
              onClick={handleTogglePush}
            >
              {pushEnabled ? "Activadas ✓" : "Activar en este móvil"}
            </button>
          </div>
        </section>

        {/* WhatsApp Fallback (Evolution API) */}
        <section className="schedule">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Icon name="phone" size={18} />
                <h2 style={{ fontSize: "15px" }}>Contingencia WhatsApp (Evolution API)</h2>
              </div>
              <p className="subtitle" style={{ fontSize: "12px", margin: "6px 0 0" }}>
                Canal de contingencia automática si el correo al paciente falla o rebota.
              </p>
            </div>
            <span
              className="status"
              style={{
                background: whatsappConnected ? "#dcfce7" : "#fee2e2",
                color: whatsappConnected ? "#15803d" : "#b91c1c",
              }}
            >
              {whatsappConnected ? "CONECTADO" : "EN ESPERA"}
            </span>
          </div>

          <div style={{ marginTop: "16px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
            {!whatsappConnected ? (
              <div>
                <p style={{ fontSize: "12px", color: "var(--ink-muted)", margin: "0 0 12px" }}>
                  Vincula la instancia de WhatsApp de tu consultorio escaneando el código QR.
                </p>
                <button
                  className="primary-button"
                  style={{ width: "auto" }}
                  onClick={() => setShowQr(!showQr)}
                >
                  {showQr ? "Ocultar QR" : "Escanear Código QR"}
                </button>
                {showQr && (
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "20px",
                      background: "var(--canvas)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "160px",
                        height: "160px",
                        background: "#fff",
                        border: "1px solid var(--line)",
                        borderRadius: "10px",
                        margin: "0 auto 12px",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "12px",
                        color: "var(--ink-muted)",
                      }}
                    >
                      [QR CODE EVOLUTION]
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--ink-muted)", display: "block" }}>
                      Abre WhatsApp &gt; Dispositivos vinculados &gt; Vincular un dispositivo
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--brand)", fontWeight: 600 }}>
                  Instancia &lsquo;medora_consultorio&rsquo; activa y lista para reenvíos.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Email y Calendario (Resend) */}
        <section className="schedule">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon name="mail" size={18} />
            <h2 style={{ fontSize: "15px" }}>Servicio de Correo (Resend RFC 5545)</h2>
          </div>
          <p className="subtitle" style={{ fontSize: "12px", margin: "6px 0 0" }}>
            Despacho automático de confirmaciones con adjunto .ics y firma criptográfica de Webhook vía Svix.
          </p>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--brand)", fontWeight: 600 }}>
            Remitente: turnos@medora-app.com (Configurado)
          </div>
        </section>
      </div>
    </main>
  );
}
