"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../providers/AuthProvider";

import { LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const doctorName = user?.fullName || "Dra. Elena Vargas";
  const doctorSpecialty = user?.specialty || "Medicina General";
  const initials = doctorName
    .replace(/^Dr\.\s+|^Dra\.\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "EV";

  const items: { href: string; label: string; icon: IconName }[] = [
    { href: "/agenda", label: "Agenda", icon: "calendar" },
    { href: "/patients", label: "Pacientes", icon: "users" },
    { href: "/records", label: "Expedientes", icon: "file" },
  ];

  return (
    <aside className="sidebar">
      <Logo />
      <nav className="side-nav" aria-label="Navegación principal">
        <p className="nav-label">CONSULTORIO</p>
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              href={item.href}
              className={`nav-item ${isActive ? "is-active" : ""}`}
              key={item.href}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="side-bottom">
        <Link href="/settings" className={`nav-item ${pathname === "/settings" ? "is-active" : ""}`}>
          <Icon name="settings" />
          <span>Configuración</span>
        </Link>
        <Link href="/" className="nav-item" style={{ fontSize: "12px", color: "#8fa6a7" }}>
          <Icon name="arrow" size={14} />
          <span>Sitio Informativo</span>
        </Link>
        <div className="profile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar initials={initials} tone="navy" />
            <div>
              <strong>{doctorName}</strong>
              <span>{doctorSpecialty}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.href = "/login";
            }}
            title="Cerrar sesión"
            style={{
              background: "transparent",
              border: 0,
              color: "#8fa6a7",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              display: "grid",
              placeItems: "center",
              transition: "color 0.15s ease",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
