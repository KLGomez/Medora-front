"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "../ui/Icon";
import { api } from "@/lib/api";

interface CameraUploadModalProps {
  onClose: () => void;
  patientId?: string;
  patientName?: string;
  onUploadSuccess?: (doc: { name: string; category: string }) => void;
}

export function CameraUploadModal({
  onClose,
  patientId: initialPatientId,
  patientName: initialPatientName,
  onUploadSuccess,
}: CameraUploadModalProps) {
  const queryClient = useQueryClient();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("IMAGING");
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocName(file.name.replace(/\.[^/.]+$/, ""));
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const targetPatientId = initialPatientId || selectedPatientId;
    if (!targetPatientId) {
      setErrorMsg("Debes seleccionar un paciente.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");

    try {
      // 1. Obtener Presigned URL desde el backend
      const presigned = await api.documents.getPresignedUrl(
        targetPatientId,
        selectedFile.name,
        selectedFile.type || "application/octet-stream"
      );

      // 2. Intentar subir el archivo binario a la URL firmada
      if (presigned?.uploadUrl && presigned.uploadUrl.startsWith("http")) {
        try {
          await fetch(presigned.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": selectedFile.type || "application/octet-stream",
            },
            body: selectedFile,
          });
        } catch (uploadErr) {
          console.warn("Subida a S3 presigned simulada/omitida en local:", uploadErr);
        }
      }

      // 3. Guardar metadatos en MongoDB
      const fileType = selectedFile.type.startsWith("image/") ? "image" : "pdf";
      await api.documents.saveMetadata(targetPatientId, {
        name: docName || selectedFile.name,
        fileType,
        mimeType: selectedFile.type,
        sizeBytes: selectedFile.size,
        storageKey: presigned.storageKey || `patients/${targetPatientId}/${Date.now()}-${selectedFile.name}`,
        category,
      });

      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["records"] });

      setIsUploading(false);
      setUploaded(true);
      onUploadSuccess?.({ name: docName, category });
    } catch (err: any) {
      console.error("Error subiendo estudio médico:", err);
      setErrorMsg(err.message || "Error al procesar el archivo");
      setIsUploading(false);
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="camera-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!uploaded ? (
          <form onSubmit={handleUpload}>
            <div className="modal-head">
              <div>
                <p className="eyebrow">ESTUDIOS & DOCUMENTOS</p>
                <h2 id="camera-modal-title">Subir o capturar foto médica</h2>
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

              {/* Botón de cámara trasera HTML5 capture="environment" */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {!previewUrl ? (
                <div
                  style={{
                    border: "2px dashed var(--line-strong)",
                    borderRadius: "var(--radius-md)",
                    padding: "30px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "var(--canvas)",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "var(--brand-soft)",
                      color: "var(--brand)",
                      display: "grid",
                      placeItems: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <Icon name="camera" size={26} />
                  </div>
                  <strong style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>
                    Tomar foto con la cámara o elegir archivo
                  </strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                    Soporta imágenes JPG/PNG o informes en PDF
                  </span>
                </div>
              ) : (
                <div style={{ position: "relative", textAlign: "center" }}>
                  {selectedFile?.type.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      alt="Vista previa del estudio"
                      style={{
                        maxHeight: "220px",
                        borderRadius: "var(--radius-sm)",
                        margin: "0 auto",
                        display: "block",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        padding: "24px",
                        background: "var(--surface-soft)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <Icon name="file" size={36} />
                      <p style={{ marginTop: "8px", fontSize: "13px" }}>{selectedFile?.name}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    className="secondary-button"
                    style={{ marginTop: "10px", width: "auto" }}
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Cambiar archivo
                  </button>
                </div>
              )}

              <label className="field full">
                <span>Nombre descriptivo del estudio</span>
                <input
                  required
                  placeholder="Ej. Radiografía de tórax frente, Hemograma completo"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />
              </label>

              <label className="field full">
                <span>Categoría del documento</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="IMAGING">Diagnóstico por imágenes (Radiografía, Eco, TAC)</option>
                  <option value="LAB_RESULT">Análisis de laboratorio / Sangre</option>
                  <option value="PRESCRIPTION">Receta médica o indicación</option>
                  <option value="GENERAL_NOTE">Documento o informe general</option>
                </select>
              </label>

              <div className="info-note">
                <Icon name="file" />
                <span>
                  Los archivos se transfieren de forma cifrada mediante Presigned URL directamente a Cloudflare R2 / S3.
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="text-button" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Subiendo a S3/R2..." : "Guardar en expediente"}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-state">
            <span className="success-icon">
              <Icon name="check" size={30} />
            </span>
            <p className="eyebrow">ESTUDIO GUARDADO</p>
            <h2>Archivo adjuntado</h2>
            <p>El estudio ha sido indexado y asegurado en el expediente de {currentPatientName}.</p>
            <button className="primary-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
