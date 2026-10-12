"use client";

import React from "react";
import { Icon } from "../ui/Icon";
import { Avatar } from "../ui/Avatar";
import type { Appointment, EmailDeliveryStatus } from "@/types";

export interface AppointmentDisplayItem {
  id?: string;
  patientId?: string;
  time: string;
  end: string;
  patient: string;
  reason: string;
  initials: string;
  tone: string;
  status: string;
  statusType: "active" | "confirmed" | "pending" | "cancelled";
  mailStatus: EmailDeliveryStatus | string;
  whatsappSent?: boolean;
}

export function AppointmentCard({
  item,
  onOpenRecord,
}: {
  item: AppointmentDisplayItem;
  onOpenRecord?: (patientName: string) => void;
}) {
  const getMailLabel = (status: string) => {
    switch (status) {
      case "OPENED":
      case "Abierto":
        return "Email abierto";
      case "DELIVERED":
      case "Entregado":
        return "Email entregado";
      case "SENT":
      case "Enviado":
        return "Email enviado";
      case "BOUNCED":
        return "Email rebotó ⚠️";
      case "PENDING":
        return "Email pendiente";
      default:
        return `Email ${status.toLowerCase()}`;
    }
  };

  const isBounced = item.mailStatus === "BOUNCED";

  return (
    <article className={`appointment-card ${item.statusType === "active" ? "current" : ""}`}>
      <div className="appointment-main">
        <Avatar initials={item.initials} tone={item.tone} />
        <div className="appointment-copy">
          <div className="patient-line">
            <strong>{item.patient}</strong>
            <span className={`status status-${item.statusType}`}>{item.status}</span>
            {item.whatsappSent && (
              <span className="status" style={{ background: '#dcfce7', color: '#15803d' }}>
                WhatsApp ✓
              </span>
            )}
          </div>
          <p>{item.reason}</p>
          <div className="meta-row">
            <span>
              <Icon name="clock" size={15} />
              {item.time} — {item.end}
            </span>
            <span style={isBounced ? { color: 'var(--danger)', fontWeight: 600 } : undefined}>
              <Icon name="mail" size={15} />
              {getMailLabel(item.mailStatus)}
            </span>
          </div>
        </div>
      </div>
      <button
        className="card-action"
        aria-label={`Abrir ficha de ${item.patient}`}
        onClick={() => onOpenRecord?.(item.patient)}
      >
        <span>Ver ficha</span>
        <Icon name="chevron" />
      </button>
    </article>
  );
}
