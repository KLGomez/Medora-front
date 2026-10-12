"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function useAppointmentsStream(onStatusUpdate?: (event: any) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(`${API_URL}/appointments/stream`, {
        withCredentials: true,
      });

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          // Invalida consultas de turnos para refrescar badges automáticamente
          queryClient.invalidateQueries({ queryKey: ["appointments"] });
          onStatusUpdate?.(parsed);
        } catch {
          // ignore parse errors
        }
      };

      eventSource.onerror = () => {
        // En caso de desconexión, EventSource reintenta automáticamente
      };
    } catch {
      // Stream no disponible en offline
    }

    return () => {
      eventSource?.close();
    };
  }, [queryClient, onStatusUpdate]);
}
