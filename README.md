# Medora Frontend — Mobile-First PWA

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Mobile_First-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

**Medora Frontend** es la aplicación cliente Progressive Web App (PWA) de Medora App. Diseñada bajo una filosofía estrictamente **Mobile-First**, proporciona al profesional de la salud una interfaz ultrarrápida, ergonómica y táctil para gestionar turnos diarios, documentar evoluciones clínicas (SOAP), cargar estudios por imágenes directamente desde la cámara del celular y dialogar en tiempo real con **CORA**, el copiloto clínico de inteligencia artificial.

---

## 1. Características Principales

- **Diseño Ergonómico Mobile-First:**
  - Optimizado para navegación con una sola mano mediante una barra inferior flotante (`MobileNav`) y *touch targets* mínimos de 48px.
  - Adaptabilidad fluida a pantallas de escritorio con barra lateral colapsable (`Sidebar`) y cabecera unificada (`Header`).
- **Landing Page Interactiva (`/`):**
  - Muestrario interactivo con simuladores en vivo de Agenda Diaria, Ficha del Paciente y Redacción SOAP.
  - Detección inteligente de sesión para redirigir inmediatamente a `/agenda` si el profesional ya está autenticado.
- **Agenda Diaria Reactiva (`/agenda`):**
  - Grilla diaria con métricas en tiempo real (`DaySummary`): confirmados, en consulta, pendientes y cancelados.
  - Badges visuales de trazabilidad de entrega de confirmaciones (`Abierto ✓`, `Entregado ✓`, `Rebotó ⚠️ (WhatsApp ✓)`).
  - Sincronización continua sin recargar la página mediante Server-Sent Events (`useAppointmentsStream`).
  - Modal de alta rápida de citas con autoselección de paciente (`NewAppointmentModal`).
- **Directorio de Pacientes (`/patients`):**
  - Búsqueda instantánea por DNI, nombre o apellido.
  - Alta rápida de pacientes con validación de datos filiatorios, cobertura y antecedentes alérgicos (`NewPatientModal`).
- **Expediente Clínico Multimedia (`/records`):**
  - Registro de evoluciones clínicas estructuradas (Motivo de consulta, Exploración diagnóstica, Tratamiento e Indicaciones).
  - Captura directa con la cámara del dispositivo móvil (`capture="environment"`) para fotografías de lesiones o estudios complementarios (`CameraUploadModal`).
  - Transferencia binaria directa a buckets AWS S3 o Cloudflare R2 mediante **Presigned URLs** prefirmadas.
- **Copiloto Clínico CORA (`CoraSheet`):**
  - Panel deslizante lateral/inferior accesible en cualquier pantalla mediante el botón flotante `✦` o la cabecera.
  - *Action Chips* con prompts contextuales ("¿Qué turnos tengo hoy?", "Antecedentes de Mariana López", etc.).
  - Motor de renderizado Markdown de alto rendimiento (`CoraMessageRenderer`) con soporte de tablas, listas, callouts y bloques SOAP.
  - Función **"Copiar a evolución"** con 1 clic: transfiere el borrador médico generado directamente al formulario de nota clínica.
- **Ajustes y Conectividad (`/settings`):**
  - Auditoría del estado de vinculación de WhatsApp vía Evolution API con código QR en vivo.
  - Suscripción y prueba de notificaciones Web Push táctiles (VAPID).

---

## 2. Arquitectura de Frontend

```
┌────────────────────────────────────────────────────────────────────────┐
│                              ROOT LAYOUT                               │
│  - globals.css (Tokens de diseño HSL, variables CSS y tipografías)     │
│  - QueryProvider (TanStack React Query Cache)                          │
│  - AuthProvider (Manejo de sesión HttpOnly y perfil del profesional)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                 [ Rutas Públicas ]     [ AppShell (Rutas Privadas) ]
                 - Landing Page (/)     ├── Header
                 - Login (/login)       ├── Sidebar (Desktop)
                                        ├── MobileNav (Móvil)
                                        ├── Botón Flotante CORA (✦)
                                        ├── Modales Globales:
                                        │   ├── NewAppointmentModal
                                        │   ├── NewNoteModal (Borradores)
                                        │   └── CoraSheet (Copiloto)
                                        └── Vistas de Contenido:
                                            ├── /agenda
                                            ├── /patients
                                            ├── /records
                                            └── /settings
```

---

## 3. Estructura de Directorios

```
medora-frontend/
├── public/
│   ├── icon.png                 # Ícono PWA para pantallas de inicio
│   ├── apple-icon.png           # Ícono para dispositivos iOS
│   └── manifest.json            # Manifiesto de PWA
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout raíz, Providers y Meta PWA
│   │   ├── page.tsx             # Landing Page pública interactiva
│   │   ├── globals.css          # Estilos globales y tokens CSS
│   │   ├── login/
│   │   │   └── page.tsx         # Pantalla de inicio de sesión médica
│   │   ├── agenda/
│   │   │   └── page.tsx         # Gestión diaria de turnos con SSE
│   │   ├── patients/
│   │   │   └── page.tsx         # Directorio y fichas de pacientes
│   │   ├── records/
│   │   │   └── page.tsx         # Expediente clínico y evoluciones SOAP
│   │   └── settings/
│   │       └── page.tsx         # Estado del sistema, WhatsApp y Web Push
│   ├── components/
│   │   ├── agenda/
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── DaySummary.tsx
│   │   │   └── NewAppointmentModal.tsx
│   │   ├── cora/
│   │   │   ├── CoraSheet.tsx
│   │   │   └── CoraMessageRenderer.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── patients/
│   │   │   └── NewPatientModal.tsx
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   ├── records/
│   │   │   ├── CameraUploadModal.tsx
│   │   │   └── NewNoteModal.tsx
│   │   └── ui/
│   │       ├── Avatar.tsx
│   │       ├── Icon.tsx
│   │       └── Logo.tsx
│   ├── hooks/
│   │   └── useAppointmentsStream.ts  # Suscripción reactiva a SSE
│   ├── lib/
│   │   └── api.ts                    # Cliente HTTP tipado con credenciales
│   └── types/
│       └── index.ts                  # Tipos TypeScript del dominio clínico
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 4. Flujo de Datos y Capa de Red (`src/lib/api.ts`)

La aplicación interactúa con la API de NestJS incluyendo credenciales de sesión (`credentials: "include"`) en todas las solicitudes, garantizando el envío transparente de la cookie HttpOnly `access_token`:

```typescript
// Módulos de la API disponibles:
api.auth.login(email, password)
api.auth.logout()
api.auth.me()

api.patients.getAll(query)
api.patients.getById(id)
api.patients.create(data)

api.appointments.getByDate(date)
api.appointments.create(data)
api.appointments.updateStatus(id, status)

api.records.getAll()
api.records.getNotes(patientId)
api.records.createNote(patientId, data)

api.documents.getAll()
api.documents.getPresignedUrl(patientId, filename, mimeType)
api.documents.saveMetadata(patientId, metadata)

api.cora.chat(message, patientContextId)
api.whatsapp.getStatus()
```

### Sincronización en Tiempo Real (SSE):
El hook `useAppointmentsStream` establece una conexión unidireccional persistente contra `GET /appointments/stream`. Al recibirse eventos como `email_status_updated`, invalida automáticamente las claves de consulta correspondientes en el caché de TanStack Query (`queryKey: ["appointments"]`), actualizando la interfaz instantáneamente.

---

## 5. Tokens de Diseño y Variables CSS

Definidos en `src/app/globals.css`, proporcionan una identidad visual médica sobria y moderna:

```css
:root {
  --brand: #0b665b;       /* Teal clínico principal */
  --brand-light: #e6f4f1; /* Superficie de acento suave */
  --navy: #183b46;        /* Tonalidad secundaria profunda */
  --canvas: #f8fafc;      /* Fondo neutro descansado */
  --ink: #0f172a;         /* Color de texto principal */
  --line: #e2e8f0;        /* Bordes y separadores sutiles */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}
```

---

## 6. Variables de Entorno

Crear un archivo `.env.local` en la raíz de `medora-frontend/`:

```env
# URL base de la API de Medora Backend (NestJS)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Clave pública para suscripción Web Push VAPID (RFC 8292)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 7. Instalación y Ejecución

### Prerrequisitos:
- Node.js 20 o superior.
- Gestor de paquetes `pnpm` (recomendado) o `npm`.

### Paso 1: Instalar dependencias
```bash
cd medora-frontend
pnpm install
```

### Paso 2: Iniciar el servidor de desarrollo
```bash
pnpm run dev
```

La aplicación abrirá en: `http://localhost:3000`.

### Paso 3: Compilar para producción
```bash
pnpm run build
pnpm run start
```

### Paso 4: Comprobación de tipos y linter
```bash
pnpm run lint
```

---

## 8. Repositorio Remoto

- **URL de GitHub:** `git@github.com:KLGomez/Medora-front.git`
- **Rama Principal:** `main`
