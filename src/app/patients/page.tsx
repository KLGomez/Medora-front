"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { NewPatientModal } from "@/components/patients/NewPatientModal";
import { CameraUploadModal } from "@/components/records/CameraUploadModal";
import { NewNoteModal } from "@/components/records/NewNoteModal";
import { api } from "@/lib/api";

interface PatientItem {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  healthInsurance: string;
  affiliateNumber?: string;
  detail: string;
  initials: string;
  tone: string;
  allergies?: string[];
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [activePatient, setActivePatient] = useState<PatientItem | null>(null);
  const [cameraPatient, setCameraPatient] = useState<{ id: string; name: string } | null>(null);
  const [notePatient, setNotePatient] = useState<{ id: string; name: string } | null>(null);

  // Consulta de pacientes reales desde MongoDB
  const { data: rawPatients, isLoading, refetch } = useQuery({
    queryKey: ["patients"],
    queryFn: () => api.patients.getAll(),
  });

  // Consulta de notas y documentos del paciente activo
  const { data: patientNotes } = useQuery({
    queryKey: ["patient-notes", activePatient?.id],
    queryFn: () => (activePatient?.id ? api.records.getNotes(activePatient.id) : Promise.resolve([])),
    enabled: !!activePatient?.id,
  });

  const { data: patientDocs } = useQuery({
    queryKey: ["patient-docs", activePatient?.id],
    queryFn: () => (activePatient?.id ? api.documents.getByPatient(activePatient.id) : Promise.resolve([])),
    enabled: !!activePatient?.id,
  });

  const patients: PatientItem[] = (rawPatients || []).map((p: any, idx: number) => {
    const tones = ["mint", "blue", "sand", "lilac"];
    const tone = tones[idx % tones.length];
    const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Paciente";
    const initials =
      ((p.firstName?.[0] || "") + (p.lastName?.[0] || "")).toUpperCase() || "PA";

    return {
      id: p._id,
      name: fullName,
      firstName: p.firstName,
      lastName: p.lastName,
      dni: p.dni,
      phone: p.phone,
      email: p.email,
      healthInsurance: p.healthInsurance || "Particular",
      affiliateNumber: p.affiliateNumber,
      detail: p.affiliateNumber ? `Afiliado: ${p.affiliateNumber}` : "Consulta general",
      initials,
      tone,
      allergies: p.allergies || [],
    };
  });

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.dni && p.dni.includes(search)) ||
      (p.phone && p.phone.includes(search)) ||
      (p.healthInsurance && p.healthInsurance.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">DIRECTORIO CLÍNICO</p>
          <h1>Pacientes</h1>
          <p className="subtitle">
            {isLoading
              ? "Cargando directorio de pacientes..."
              : `${patients.length} pacientes registrados en el consultorio.`}
          </p>
        </div>
        <button className="primary-button" onClick={() => setShowNewPatientModal(true)}>
          <Icon name="plus" /> Nuevo paciente
        </button>
      </div>

      <section className="patients-panel">
        <div className="patient-search">
          <Icon name="search" />
          <input
            placeholder="Buscar por nombre, DNI, teléfono u obra social..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="patient-list">
          {isLoading && (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-muted)" }}>
              Consultando pacientes en MongoDB...
            </div>
          )}

          {!isLoading && filteredPatients.map((patient) => (
            <div
              className="patient-row"
              key={patient.id}
              onClick={() => setActivePatient(patient)}
            >
              <Avatar initials={patient.initials} tone={patient.tone} />
              <div>
                <strong>{patient.name}</strong>
                <span>
                  DNI: {patient.dni} · {patient.healthInsurance} · 📞 {patient.phone}
                </span>
                {patient.allergies && patient.allergies.length > 0 && (
                  <span style={{ color: "var(--danger)", fontWeight: 600, fontSize: "11px", display: "block", marginTop: "2px" }}>
                    ⚠️ Alergias: {patient.allergies.join(", ")}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                  type="button"
                  className="icon-button"
                  style={{ width: "32px", height: "32px" }}
                  title="Capturar estudio o foto médica"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCameraPatient({ id: patient.id, name: patient.name });
                  }}
                >
                  <Icon name="camera" size={16} />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  style={{ width: "32px", height: "32px" }}
                  title="Registrar evolución diagnóstica"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotePatient({ id: patient.id, name: patient.name });
                  }}
                >
                  <Icon name="file" size={16} />
                </button>
              </div>
              <span className="record-tag">
                <Icon name="chevron" size={16} />
              </span>
            </div>
          ))}

          {!isLoading && filteredPatients.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--ink-muted)" }}>
              No se encontraron pacientes para &ldquo;{search}&rdquo;.
            </div>
          )}
        </div>
      </section>

      {/* Modal Ficha Completa Paciente */}
      {activePatient && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setActivePatient(null)}>
          <section
            className="modal"
            style={{ maxWidth: "620px", maxHeight: "90vh", overflowY: "auto" }}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Avatar initials={activePatient.initials} tone={activePatient.tone} />
                <div>
                  <h2 style={{ fontSize: "18px" }}>{activePatient.name}</h2>
                  <p className="subtitle" style={{ fontSize: "12px", margin: "2px 0 0" }}>
                    DNI: {activePatient.dni} · {activePatient.healthInsurance}
                    {activePatient.affiliateNumber ? ` · Afiliado: ${activePatient.affiliateNumber}` : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setActivePatient(null)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
              <div style={{ padding: "14px", background: "var(--canvas)", borderRadius: "var(--radius-sm)" }}>
                <strong style={{ fontSize: "12px", color: "var(--ink-muted)", display: "block" }}>CONTACTO</strong>
                <p style={{ margin: "4px 0 0", fontSize: "13px" }}>📞 {activePatient.phone}</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px" }}>✉️ {activePatient.email}</p>
              </div>

              {activePatient.allergies && activePatient.allergies.length > 0 && (
                <div style={{ padding: "12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius-sm)", color: "#b91c1c" }}>
                  <strong style={{ fontSize: "11px", display: "block" }}>⚠️ ANTECEDENTES Y ALERGIAS</strong>
                  <span style={{ fontSize: "12px" }}>{activePatient.allergies.join(", ")}</span>
                </div>
              )}

              {/* Historial clínico reciente */}
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                <strong style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Evoluciones clínicas ({Array.isArray(patientNotes) ? patientNotes.length : 0})
                </strong>
                {Array.isArray(patientNotes) && patientNotes.length > 0 ? (
                  <div style={{ display: "grid", gap: "8px" }}>
                    {patientNotes.map((note: any) => (
                      <div
                        key={note._id}
                        style={{
                          padding: "10px 12px",
                          background: "var(--surface)",
                          border: "1px solid var(--line)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px",
                        }}
                      >
                        <strong style={{ color: "var(--brand)", display: "block" }}>
                          {note.chiefComplaint || "Evolución clínica"}
                        </strong>
                        <p style={{ margin: "4px 0", whiteSpace: "pre-wrap" }}>{note.clinicalNotes}</p>
                        {note.treatment && (
                          <span style={{ color: "var(--ink-muted)", display: "block", fontSize: "11px" }}>
                            Plan: {note.treatment}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "var(--ink-muted)" }}>Sin notas clínicas registradas.</p>
                )}
              </div>

              {/* Estudios adjuntos */}
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                <strong style={{ fontSize: "13px", display: "block", marginBottom: "8px" }}>
                  Estudios y fotos ({Array.isArray(patientDocs) ? patientDocs.length : 0})
                </strong>
                {Array.isArray(patientDocs) && patientDocs.length > 0 ? (
                  <div style={{ display: "grid", gap: "8px" }}>
                    {patientDocs.map((doc: any) => (
                      <div
                        key={doc._id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          background: "var(--surface)",
                          border: "1px solid var(--line)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px",
                        }}
                      >
                        <div>
                          <strong>{doc.name}</strong>
                          <span style={{ display: "block", fontSize: "11px", color: "var(--ink-muted)" }}>
                            {doc.category} · {doc.fileType}
                          </span>
                        </div>
                        <Icon name={doc.fileType === "image" ? "camera" : "file"} size={16} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "var(--ink-muted)" }}>Sin archivos médicos subidos.</p>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  className="primary-button"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const p = { id: activePatient.id, name: activePatient.name };
                    setActivePatient(null);
                    setNotePatient(p);
                  }}
                >
                  <Icon name="file" size={16} /> Nueva evolución
                </button>
                <button
                  className="secondary-button"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const p = { id: activePatient.id, name: activePatient.name };
                    setActivePatient(null);
                    setCameraPatient(p);
                  }}
                >
                  <Icon name="camera" size={16} /> Tomar foto / estudio
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {showNewPatientModal && (
        <NewPatientModal
          onClose={() => setShowNewPatientModal(false)}
          onPatientCreated={() => {
            refetch();
          }}
        />
      )}

      {cameraPatient && (
        <CameraUploadModal
          patientId={cameraPatient.id}
          patientName={cameraPatient.name}
          onClose={() => setCameraPatient(null)}
        />
      )}

      {notePatient && (
        <NewNoteModal
          patientId={notePatient.id}
          patientName={notePatient.name}
          onClose={() => setNotePatient(null)}
        />
      )}
    </main>
  );
}
