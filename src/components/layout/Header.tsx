"use client";

import React from "react";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";

interface HeaderProps {
  onNewAppointment?: () => void;
  onOpenCora?: () => void;
}

export function Header({ onNewAppointment, onOpenCora }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="mobile-logo">
        <Logo />
      </div>
      <div className="search-box">
        <Icon name="search" />
        <input aria-label="Buscar pacientes" placeholder="Buscar paciente..." />
        <kbd>⌘ K</kbd>
      </div>
      <div className="header-actions">
        {onOpenCora && (
          <button 
            className="icon-button" 
            aria-label="Abrir CORA Copiloto" 
            onClick={onOpenCora}
            title="CORA Copiloto Clínico"
            style={{ color: 'var(--brand)' }}
          >
            <Icon name="sparkles" size={19} />
          </button>
        )}
        <button className="icon-button" aria-label="Notificaciones">
          <Icon name="bell" />
          <span className="notification-dot" />
        </button>
        {onNewAppointment && (
          <button className="primary-button desktop-new" onClick={onNewAppointment}>
            <Icon name="plus" /> Nuevo turno
          </button>
        )}
      </div>
    </header>
  );
}
