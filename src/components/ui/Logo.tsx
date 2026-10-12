import React from "react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
      <span className="brand-mark"><span /></span>
      <span className="brand-name">Medora</span>
    </Link>
  );
}
