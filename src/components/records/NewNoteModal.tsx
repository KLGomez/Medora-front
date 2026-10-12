"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "../ui/Icon";
import { api } from "@/lib/api";

interface NewNoteModalProps {
  onClose: () => void;
  patientId?: string;
  patientName?: string;
  initialText?: string;
  onNoteCreated?: (note: {
    chiefComplaint: string;
    clinicalNotes: string;
    treatment: string;
  }) => void;
}

export function NewNoteModal({
  onClose,
  patientId: initialPatientId,
  patientName: initialPatientName,
  initialText = "",
  onNoteCreated,
}: NewNoteModalProps) {
  const queryClient = useQueryClient();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || "");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState(initialText);
  const [treatment, setTreatment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!initialPatientId) {
      api.patients.getAll().then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setPatients(list);
          setSelectedPatientId(list[0]._id);
        }
      }).catch(console.error);
    }
  }, [initialPatientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = initialPatientId || selectedPatientId;
    if (!targetId) {
      setErrorMsg("Debes seleccionar un paciente.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await api.records.createNote(targetId, {
        chiefComplaint,
        clinicalNotes,
        treatment,
      });

      await queryClient.invalidateQueries({ queryKey: ["records"] });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });

      setSaved(true);
      onNoteCreated?.({ chiefComplaint, clinicalNotes, treatment });
    } catch (err: any) {
      console.error("Error guardando evolución clínica:", err);
      setErrorMsg(err.message || "Error al registrar la evolución");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPatientName =
    initialPatientName ||
    patients.find((p) => p._id === selectedPatientId)?.firstName +
      " " +
      patients.find((p) => p._id === selectedPatientId)?.lastName ||
    "Paciente";

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        style={{ maxWidth: "620px" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!saved ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-head">
              <div>
                <p className="eyebrow">HISTORIAL CLÍNICO</p>
                <h2 id="note-modal-title">Nueva evolución médica</h2>
                <p className="subtitle" style={{ fontSize: "12px", marginTop: "4px" }}>
                  Paciente: <strong>{currentPatientName}</strong>
                </p>
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

            <div style={{ display: "grid", gap: "16px" }}>
              {!initialPatientId && patients.length > 0 && (
                <label className="field full">
                  <span>Seleccionar Paciente</span>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    style={{
                      height: "42px",
                      padding: "0 12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--line)",
                      background: "var(--surface)",
                    }}
                  >
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.firstName} {p.lastName} — DNI {p.dni}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="field full">
                <span>Motivo de consulta (Chief Complaint)</span>
                <input
                  required
                  placeholder="Ej. Control preventivo, odinofagia persistente, cefalea"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                />
              </label>

              <label className="field full">
                <span>Exploración, anamnesis y diagnóstico (Clinical Notes)</span>
                <textarea
                  required
                  style={{ height: "110px" }}
                  placeholder="Detalla los hallazgos físicos, signos vitales y diagnóstico presuntivo o definitivo..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                />
              </label>

              <label className="field full">
                <span>Indicaciones y plan terapéutico / farmacológico</span>
                <textarea
                  style={{ height: "80px" }}
                  placeholder="Medicamentos, dosis, pautas de alarma y estudios solicitados..."
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                />
              </label>
            </div>

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button type="button" className="text-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Guardando en MongoDB..." : "Guardar en expediente"}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-state">
            <span className="success-icon">
              <Icon name="check" size={30} />
            </span>
            <p className="eyebrow">EVOLUCIÓN REGISTRADA</p>
            <h2>Guardado con éxito</h2>
            <p>
              La evolución clínica fue almacenada en el expediente longitudinal de {currentPatientName}.
            </p>
            <button className="primary-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
