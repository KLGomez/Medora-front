"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "../ui/Icon";
import { api } from "@/lib/api";

interface NewPatientModalProps {
  onClose: () => void;
  onPatientCreated?: (data: {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    healthInsurance?: string;
    affiliateNumber?: string;
    allergies?: string[];
  }) => void;
}

export function NewPatientModal({ onClose, onPatientCreated }: NewPatientModalProps) {
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [healthInsurance, setHealthInsurance] = useState("");
  const [affiliateNumber, setAffiliateNumber] = useState("");
  const [allergies, setAllergies] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      firstName,
      lastName,
      dni,
      email,
      phone,
      healthInsurance: healthInsurance || "Particular",
      affiliateNumber: affiliateNumber || undefined,
      allergies: allergies
        ? allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      await api.patients.create(payload);
      await queryClient.invalidateQueries({ queryKey: ["patients"] });

      setSaved(true);
      onPatientCreated?.(payload);
    } catch (err: any) {
      console.error("Error creando paciente en backend:", err);
      setErrorMsg(err.message || "Error al dar de alta el paciente");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-patient-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!saved ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-head">
              <div>
                <p className="eyebrow">FICHA CLÍNICA</p>
                <h2 id="modal-patient-title">Nuevo Paciente</h2>
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
              <label className="field">
                <span>Nombre</span>
                <input
                  required
                  placeholder="Ej. Sofía"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Apellido</span>
                <input
                  required
                  placeholder="Ej. Ramírez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label className="field">
                <span>DNI / Documento</span>
                <input
                  required
                  placeholder="Ej. 34567890"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Teléfono / WhatsApp</span>
                <input
                  required
                  placeholder="Ej. +54 9 11 1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="field full">
                <span>Correo electrónico</span>
                <input
                  type="email"
                  required
                  placeholder="paciente@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Cobertura médica / Obra social</span>
                <input
                  placeholder="Ej. OSDE 310 / Particular"
                  value={healthInsurance}
                  onChange={(e) => setHealthInsurance(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Nº Afiliado</span>
                <input
                  placeholder="Ej. 123456789-01"
                  value={affiliateNumber}
                  onChange={(e) => setAffiliateNumber(e.target.value)}
                />
              </label>
              <label className="field full">
                <span>Alergias conocidas (separadas por comas)</span>
                <input
                  placeholder="Ej. Penicilina, Ibuprofeno, Dipirona"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="text-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? "Guardando en MongoDB..." : "Dar de alta"}
              </button>
            </div>
          </form>
        ) : (
          <div className="success-state">
            <span className="success-icon">
              <Icon name="check" size={30} />
            </span>
            <p className="eyebrow">PACIENTE REGISTRADO</p>
            <h2>Paciente creado con éxito</h2>
            <p>El paciente ha sido dado de alta en MongoDB y ya está disponible para turnos y expediente.</p>
            <button className="primary-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
