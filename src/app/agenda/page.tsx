"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/components/ui/Icon";
import { AppointmentCard, type AppointmentDisplayItem } from "@/components/agenda/AppointmentCard";
import { DaySummary } from "@/components/agenda/DaySummary";
import { NewAppointmentModal } from "@/components/agenda/NewAppointmentModal";
import { CameraUploadModal } from "@/components/records/CameraUploadModal";
import { NewNoteModal } from "@/components/records/NewNoteModal";
import { useAppointmentsStream } from "@/hooks/useAppointmentsStream";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";

export default function AgendaPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedPatientForCamera, setSelectedPatientForCamera] = useState<{ id: string; name: string } | null>(null);
  const [selectedPatientForNote, setSelectedPatientForNote] = useState<{ id: string; name: string } | null>(null);

  // Consulta de turnos reales desde MongoDB
  const { data: dbAppointments, isLoading, refetch } = useQuery({
    queryKey: ["appointments", selectedDate],
    queryFn: () => api.appointments.getByDate(selectedDate),
  });

  // Conexión reactiva en tiempo real por SSE
  useAppointmentsStream(() => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  });

  // Mapeo de turnos reales
  const appointments: AppointmentDisplayItem[] = (dbAppointments || []).map((a: any) => {
    const dateObj = new Date(a.dateTime);
    const time = dateObj.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const endObj = new Date(dateObj.getTime() + (a.durationMinutes || 30) * 60000);
    const end = endObj.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const p = a.patientId || {};
    const patientName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Paciente";
    const initials =
      ((p.firstName?.[0] || "") + (p.lastName?.[0] || "")).toUpperCase() || "PA";

    let statusText = "Programado";
    let statusType: "active" | "confirmed" | "pending" | "cancelled" = "pending";
    let tone: "mint" | "blue" | "sand" | "lilac" = "blue";

    if (a.status === "IN_CONSULTATION") {
      statusText = "En consulta";
      statusType = "active";
      tone = "mint";
    } else if (
      a.status === "CONFIRMED" ||
      a.emailDelivery?.status === "DELIVERED" ||
      a.emailDelivery?.status === "OPENED"
    ) {
      statusText = "Confirmado";
      statusType = "confirmed";
      tone = "blue";
    } else if (a.status === "ATTENDED") {
      statusText = "Completado";
      statusType = "confirmed";
      tone = "mint";
    } else if (a.status === "CANCELLED") {
      statusText = "Cancelado";
      statusType = "cancelled";
      tone = "sand";
    }

    return {
      id: a._id,
      patientId: p._id,
      time,
      end,
      patient: patientName,
      reason: a.reason || "Consulta médica general",
      initials,
      tone,
      status: statusText,
      statusType,
      mailStatus: a.emailDelivery?.status || "SENT",
      whatsappSent: !!a.emailDelivery?.whatsappFallbackTriggered,
    };
  });

  // Navegación de fechas
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];
  const dateFormatted = new Date(`${selectedDate}T12:00:00Z`).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const activeAppt = appointments.find((a) => a.statusType === "active");

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">AGENDA CLÍNICA</p>
          <h1>{user ? `Dra. ${user.fullName.replace(/^Dr\.\s+|^Dra\.\s+/i, "")}` : "Agenda Médica"}</h1>
          <p className="subtitle" style={{ textTransform: "capitalize" }}>
            {isToday ? `Hoy (${dateFormatted})` : dateFormatted} · {appointments.length} {appointments.length === 1 ? "turno" : "turnos"}
          </p>
        </div>
        <div className="date-control">
          <button aria-label="Día anterior" onClick={handlePrevDay}>‹</button>
          <button className={`today-button ${isToday ? "is-active" : ""}`} onClick={handleToday}>
            <Icon name="calendar" size={17} /> {isToday ? "Hoy" : "Ir a Hoy"}
          </button>
          <button aria-label="Día siguiente" onClick={handleNextDay}>›</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="schedule">
          <div className="section-title">
            <div>
              <h2>Turnos del día</h2>
              <span className="count-pill">
                {isLoading ? "Cargando..." : `${appointments.length} turnos`}
              </span>
            </div>
            <button onClick={() => setShowNewModal(true)}>
              <Icon name="plus" size={15} /> Agendar
            </button>
          </div>

          <div className="timeline">
            {isLoading && (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--ink-muted)" }}>
                Conectando con la base de datos...
              </div>
            )}

            {!isLoading && appointments.length === 0 && (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--ink-muted)" }}>
                <p style={{ margin: "0 0 12px" }}>No hay turnos agendados para este día.</p>
                <button className="secondary-button" onClick={() => setShowNewModal(true)}>
                  <Icon name="plus" size={15} /> Agendar primera cita
                </button>
              </div>
            )}

            {appointments.map((item) => (
              <div className="timeline-row" key={item.id || item.time}>
                <div className="time-label">
                  <strong>{item.time}</strong>
                  <span>{item.end}</span>
                </div>
                <AppointmentCard
                  item={item}
                  onOpenRecord={(pName) =>
                    setSelectedPatientForNote({
                      id: item.patientId || "",
                      name: pName,
                    })
                  }
                />
              </div>
            ))}

            {!isLoading && (
              <div className="timeline-row empty-slot">
                <div className="time-label">
                  <strong>+</strong>
                  <span>libre</span>
                </div>
                <button onClick={() => setShowNewModal(true)}>
                  <Icon name="plus" size={17} /> Agendar nuevo turno
                </button>
              </div>
            )}
          </div>
        </section>

        <DaySummary
          totalAppointments={appointments.length}
          attendedCount={appointments.filter((a) => a.statusType === "active").length}
          confirmedCount={appointments.filter((a) => a.statusType === "confirmed").length}
          pendingCount={appointments.filter((a) => a.statusType === "pending").length}
          onOpenCurrentRecord={() => {
            if (activeAppt) {
              setSelectedPatientForNote({
                id: activeAppt.patientId || "",
                name: activeAppt.patient,
              });
            } else if (appointments.length > 0) {
              setSelectedPatientForNote({
                id: appointments[0].patientId || "",
                name: appointments[0].patient,
              });
            }
          }}
        />
      </div>

      <button
        className="floating-button"
        onClick={() => setShowNewModal(true)}
        aria-label="Nuevo turno"
      >
        <Icon name="plus" size={25} />
      </button>

      {showNewModal && (
        <NewAppointmentModal
          onClose={() => setShowNewModal(false)}
          onAppointmentCreated={() => {
            refetch();
          }}
        />
      )}

      {selectedPatientForNote && (
        <NewNoteModal
          patientId={selectedPatientForNote.id}
          patientName={selectedPatientForNote.name}
          onClose={() => setSelectedPatientForNote(null)}
        />
      )}

      {selectedPatientForCamera && (
        <CameraUploadModal
          patientId={selectedPatientForCamera.id}
          patientName={selectedPatientForCamera.name}
          onClose={() => setSelectedPatientForCamera(null)}
        />
      )}
    </main>
  );
}
