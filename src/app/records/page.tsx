"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/Icon";
import { NewNoteModal } from "@/components/records/NewNoteModal";
import { CameraUploadModal } from "@/components/records/CameraUploadModal";
import { api } from "@/lib/api";

interface RecordCardItem {
  id: string;
  type: "note" | "document";
  date: string;
  timestamp: number;
  title: string;
  patient: string;
  patientId?: string;
  subtitle: string;
  iconType: "mint" | "blue";
  content?: string;
  treatment?: string;
  category?: string;
}

export default function RecordsPage() {
  const [filter, setFilter] = useState<"all" | "note" | "document">("all");
  const [selectedRecord, setSelectedRecord] = useState<RecordCardItem | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // Consultar notas y estudios reales desde MongoDB
  const { data: rawNotes, isLoading: loadingNotes, refetch: refetchNotes } = useQuery({
    queryKey: ["records"],
    queryFn: () => api.records.getAll(),
  });

  const { data: rawDocs, isLoading: loadingDocs, refetch: refetchDocs } = useQuery({
    queryKey: ["documents"],
    queryFn: () => api.documents.getAll(),
  });

  const notesMapped: RecordCardItem[] = (rawNotes || []).map((n: any) => {
    const d = new Date(n.createdAt || Date.now());
    const p = n.patientId || {};
    const patientName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Paciente";

    return {
      id: `note-${n._id}`,
      type: "note",
      date: d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      timestamp: d.getTime(),
      title: "Evolución clínica",
      patient: patientName,
      patientId: p._id,
      subtitle: `${patientName} · ${n.chiefComplaint || "Control general"}`,
      iconType: "mint",
      content: n.clinicalNotes,
      treatment: n.treatment,
    };
  });

  const docsMapped: RecordCardItem[] = (rawDocs || []).map((doc: any) => {
    const d = new Date(doc.createdAt || Date.now());
    const p = doc.patientId || {};
    const patientName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Paciente";

    return {
      id: `doc-${doc._id}`,
      type: "document",
      date: d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      timestamp: d.getTime(),
      title: doc.name || "Estudio complementario",
      patient: patientName,
      patientId: p._id,
      subtitle: `${patientName} · ${doc.category || "Archivo médico"}`,
      iconType: "blue",
      content: `Archivo: ${doc.name}\nTipo: ${doc.fileType} (${doc.mimeType || "desconocido"})\nAlmacenamiento: ${doc.storageKey}`,
      category: doc.category,
    };
  });

  const allRecords = [...notesMapped, ...docsMapped].sort((a, b) => b.timestamp - a.timestamp);
  const filteredRecords = allRecords.filter((r) => filter === "all" || r.type === filter);
  const isLoading = loadingNotes || loadingDocs;

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">HISTORIAL MÉDICO</p>
          <h1>Expedientes</h1>
          <p className="subtitle">
            {isLoading
              ? "Cargando expedientes clínicos..."
              : `${allRecords.length} registros clínicos y estudios complementarios en MongoDB.`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="secondary-button" onClick={() => setShowCameraModal(true)}>
            <Icon name="camera" size={16} /> Capturar estudio
          </button>
          <button className="primary-button" onClick={() => setShowNoteModal(true)}>
            <Icon name="plus" /> Nueva evolución
          </button>
        </div>
      </div>

      {/* Filtros de pestañas */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          className={filter === "all" ? "primary-button" : "secondary-button"}
          style={{ width: "auto", minHeight: "36px", fontSize: "12px", padding: "0 14px" }}
          onClick={() => setFilter("all")}
        >
          Todos ({allRecords.length})
        </button>
        <button
          className={filter === "note" ? "primary-button" : "secondary-button"}
          style={{ width: "auto", minHeight: "36px", fontSize: "12px", padding: "0 14px" }}
          onClick={() => setFilter("note")}
        >
          Evoluciones ({notesMapped.length})
        </button>
        <button
          className={filter === "document" ? "primary-button" : "secondary-button"}
          style={{ width: "auto", minHeight: "36px", fontSize: "12px", padding: "0 14px" }}
          onClick={() => setFilter("document")}
        >
          Estudios & Fotos ({docsMapped.length})
        </button>
      </div>

      {isLoading && (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-muted)" }}>
          Recuperando evoluciones y documentos de MongoDB...
        </div>
      )}

      {!isLoading && (
        <div className="records-grid">
          {filteredRecords.map((record) => (
            <article
              className="record-card"
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              style={{ cursor: "pointer" }}
            >
              <div className={`record-icon ${record.iconType === "blue" ? "blue-icon" : ""}`}>
                <Icon name={record.type === "document" ? "camera" : "file"} />
              </div>
              <span className="record-date">{record.date}</span>
              <h3>{record.title}</h3>
              <p>{record.subtitle}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRecord(record);
                }}
              >
                Ver detalle
              </button>
            </article>
          ))}

          {filteredRecords.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", color: "var(--ink-muted)" }}>
              No hay registros en esta categoría.
            </div>
          )}
        </div>
      )}

      {/* Modal detalle del expediente */}
      {selectedRecord && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedRecord(null)}>
          <section
            className="modal"
            style={{ maxWidth: "600px" }}
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: selectedRecord.iconType === "blue" ? "var(--sky-soft)" : "var(--brand-soft)",
                    color: selectedRecord.iconType === "blue" ? "var(--sky)" : "var(--brand)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name={selectedRecord.type === "document" ? "camera" : "file"} size={18} />
                </span>
                <div>
                  <p className="eyebrow">{selectedRecord.type === "document" ? "ESTUDIO ADJUNTO" : "EVOLUCIÓN CLÍNICA"}</p>
                  <h2>{selectedRecord.title}</h2>
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setSelectedRecord(null)}
                aria-label="Cerrar"
              >
                <Icon name="close" />
              </button>
            </div>

            <div style={{ marginTop: "16px", display: "grid", gap: "14px" }}>
              <div style={{ padding: "12px", background: "var(--canvas)", borderRadius: "var(--radius-sm)", fontSize: "13px" }}>
                <p style={{ margin: 0 }}><strong>Paciente:</strong> {selectedRecord.patient}</p>
                <p style={{ margin: "4px 0 0", color: "var(--ink-muted)", fontSize: "12px" }}>
                  <strong>Fecha de registro:</strong> {selectedRecord.date}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: "12px", color: "var(--ink-muted)", display: "block", marginBottom: "6px" }}>
                  {selectedRecord.type === "document" ? "DETALLES DEL ESTUDIO" : "HALLAZGOS Y EXPLORACIÓN"}
                </strong>
                <p style={{ fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap", background: "var(--surface)", padding: "12px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", margin: 0 }}>
                  {selectedRecord.content}
                </p>
              </div>

              {selectedRecord.treatment && (
                <div>
                  <strong style={{ fontSize: "12px", color: "var(--brand)", display: "block", marginBottom: "6px" }}>
                    PLAN Y TRATAMIENTO PRESCRIPTO
                  </strong>
                  <p style={{ fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap", background: "var(--surface-soft)", padding: "12px", borderRadius: "var(--radius-sm)", margin: 0 }}>
                    {selectedRecord.treatment}
                  </p>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                <button className="primary-button" onClick={() => setSelectedRecord(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {showNoteModal && (
        <NewNoteModal
          onClose={() => setShowNoteModal(false)}
          onNoteCreated={() => {
            refetchNotes();
          }}
        />
      )}

      {showCameraModal && (
        <CameraUploadModal
          onClose={() => setShowCameraModal(false)}
          onUploadSuccess={() => {
            refetchDocs();
          }}
        />
      )}
    </main>
  );
}
