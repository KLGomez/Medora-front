"use client";

import React from "react";
import { Icon } from "../ui/Icon";
import { Avatar } from "../ui/Avatar";

interface DaySummaryProps {
  totalAppointments: number;
  attendedCount: number;
  confirmedCount: number;
  pendingCount: number;
  currentPatient?: {
    name: string;
    initials: string;
    tone: string;
    endTime: string;
  };
  onOpenCurrentRecord?: () => void;
}

export function DaySummary({
  totalAppointments = 5,
  attendedCount = 1,
  confirmedCount = 3,
  pendingCount = 1,
  currentPatient = {
    name: "Mariana López",
    initials: "ML",
    tone: "mint",
    endTime: "09:45",
  },
  onOpenCurrentRecord,
}: DaySummaryProps) {
  const attendedPercent = totalAppointments > 0 ? (attendedCount / totalAppointments) * 100 : 0;

  return (
    <aside className="summary-panel">
      <div className="summary-head">
        <p>RESUMEN DEL DÍA</p>
        <span>HOY</span>
      </div>
      <strong className="big-number">{totalAppointments}</strong>
      <span className="summary-caption">turnos programados</span>
      <div className="progress">
        <span style={{ width: `${Math.max(10, attendedPercent)}%` }} />
      </div>
      <div className="summary-stats">
        <div>
          <span className="stat-dot green" />
          <strong>{attendedCount}</strong>
          <span>Atendido</span>
        </div>
        <div>
          <span className="stat-dot blue" />
          <strong>{confirmedCount}</strong>
          <span>Confirmados</span>
        </div>
        <div>
          <span className="stat-dot amber" />
          <strong>{pendingCount}</strong>
          <span>Pendiente</span>
        </div>
      </div>
      {currentPatient && (
        <div className="next-up">
          <div className="next-label">
            <span>AHORA</span>
            <span className="live-dot">EN VIVO</span>
          </div>
          <div className="next-patient">
            <Avatar initials={currentPatient.initials} tone={currentPatient.tone} />
            <div>
              <strong>{currentPatient.name}</strong>
              <span>Finaliza a las {currentPatient.endTime}</span>
            </div>
          </div>
          <button className="secondary-button" onClick={onOpenCurrentRecord}>
            Abrir expediente <Icon name="arrow" size={17} />
          </button>
        </div>
      )}
      <div className="mail-health">
        <Icon name="check" size={17} />
        <div>
          <strong>Notificaciones operativas</strong>
          <span>Eventos de calendario (.ics) despachados vía Resend</span>
        </div>
      </div>
    </aside>
  );
}
