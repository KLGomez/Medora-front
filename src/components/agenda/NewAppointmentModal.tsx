"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "../ui/Icon";
import { api } from "@/lib/api";

interface NewAppointmentModalProps {
  onClose: () => void;
  onAppointmentCreated?: (data: {
    patientName: string;
    date: string;
    time: string;
    reason: string;
  }) => void;
}

export function NewAppointmentModal({ onClose, onAppointmentCreated }: NewAppointmentModalProps) {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const list = await api.patients.getAll();
        if (Array.isArray(list)) {
          setPatients(list);
          if (list.length > 0) {
            setSelectedPatientId(list[0]._id);
          }
        }
      } catch (err) {
        console.error("Error cargando lista de pacientes:", err);
      }
    }
    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setErrorMsg("Por favor selecciona un paciente.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const dateTime = `${date}T${time}:00.000Z`;
      await api.appointments.create({
        patientId: selectedPatientId,
        dateTime,
        durationMinutes: 30,
        reason: reason || "Consulta médica general",
      });

      // Refrescar la query de turnos en caché
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });

      const selectedPatient = patients.find((p) => p._id === selectedPatientId);
      const patientName = selectedPatient
        ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
        : "Paciente";

      setSaved(true);
      onAppointmentCreated?.({ patientName, date, time, reason });
    } catch (err: any) {
      console.error("Error agendando turno:", err);
      setErrorMsg(err.message || "Error al agendar el turno");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const full = `${p.firstName} ${p.lastName} ${p.dni}`.toLowerCase();
    return full.includes(patientSearch.toLowerCase());
  });

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!saved ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-head">
              <div>
                <p className="eyebrow">NUEVA CITA</p>
                <h2 id="modal-title">Agendar turno</h2>
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

            {errorMsg && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  marginBottom: "14px",
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="form-grid">
              <label className="field full">
                <span>Seleccionar Paciente</span>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  style={{
                    height: "44px",
                    padding: "0 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                  }}
                >
                  {patients.length === 0 && <option value="">Cargando pacientes...</option>}
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.lastName} — DNI: {p.dni} ({p.healthInsurance || "Particular"})
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Fecha</span>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <label className="field">
                <span>Hora</span>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>

              <label className="field full">
                <span>Motivo de consulta</span>
                <input
                  placeholder="Ej. Control anual, Revisión de estudios, Evaluación"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>

              <label className="field full">
                <span>Modalidad</span>
                <select defaultValue="office">
                  <option value="office">En consultorio</option>
                  <option value="video">Videoconsulta</option>
                </select>
              </label>
            </div>

            <div className="info-note">
              <Icon name="mail" />
              <span>
                Al confirmar, el sistema registra el turno en MongoDB y despacha automáticamente el email al paciente con el archivo RFC 5545 (.ics).
              </span>
            </div>

            <div className="modal-actions">
              <button type="button" className="text-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="primary-button" disabled={isSubmitting || patients.length === 0}>
                {isSubmitting ? "Agendando..." : "Confirmar turno"}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-state">
            <span className="success-icon">
              <Icon name="check" size={30} />
            </span>
            <p className="eyebrow">TURNO CONFIRMADO</p>
            <h2>Todo listo</h2>
            <p>
              La cita quedó guardada en la base de datos y se disparó el despacho con el archivo de calendario RFC 5545 (.ics).
            </p>
            <button className="primary-button" onClick={onClose}>
              Volver a la agenda
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
