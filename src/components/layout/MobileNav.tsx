"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "../ui/Icon";

export function MobileNav() {
  const pathname = usePathname();

  const items: { href: string; label: string; icon: IconName }[] = [
    { href: "/agenda", label: "Agenda", icon: "home" },
    { href: "/patients", label: "Pacientes", icon: "users" },
    { href: "/records", label: "Expedientes", icon: "file" },
    { href: "/settings", label: "Ajustes", icon: "settings" },
  ];

  return (
    <nav className="mobile-nav">
      {items.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            href={item.href}
            className={isActive ? "is-active" : ""}
            key={item.href}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
