# Arquitectura — Ojo Verde

## Estado de este documento

Este documento distingue explícitamente entre lo que **ya está construido** (Incremento 1) y lo que está **planeado** (Incrementos 2 en adelante), para no describir como existente algo que todavía no se ha implementado.

## Componentes reales (Incremento 1)

```
┌───────────────────────────────────────────┐
│                  FRONTEND                    │
│  React 19 + TanStack Start/Router + TS        │
│  Tailwind CSS + shadcn/ui                     │
│                                                │
│  - Imagen satelital estática (JPG) con        │
│    marcadores posicionados por CSS            │
│  - 5 señales de ejemplo definidas en el       │
│    propio componente (src/routes/index.tsx)   │
│  - Estado en memoria (React useState)          │
│    → se pierde al recargar la página           │
└───────────────────────────────────────────┘
```

No existen, en este repositorio, ni backend, ni base de datos, ni llamadas a APIs externas. Todo el comportamiento ocurre en el navegador.

## Estructura de carpetas real

```
ojo-verde/
  ├── codigo-fuente/
  │     ├── src/
  │     │     ├── routes/          (index.tsx — pantalla única del dashboard)
  │     │     ├── components/ui/   (componentes shadcn/ui)
  │     │     ├── hooks/
  │     │     └── lib/
  │     ├── public/
  │     └── package.json
  └── README.md
```

## Flujo de datos actual

1. Al cargar la página, el componente `OjoVerdeDashboard` inicializa el arreglo `initialAlerts` (5 señales de ejemplo con ubicación, hora, confianza y factores de riesgo, escritos directamente en el código).
2. El usuario filtra por departamento, prioridad y estado; esos filtros se aplican en el propio navegador sobre el arreglo en memoria.
3. Al seleccionar una alerta y "guardar" una decisión de verificación, el estado se actualiza con `setAlerts` — solo en memoria, sin persistencia.

## Arquitectura planeada (Incrementos futuros)

```
┌──────────────┐     ┌───────────────────┐     ┌─────────────────────┐
│   FRONTEND      │ ──▶ │     BACKEND          │ ──▶ │  FUENTES EXTERNAS      │
│  (este repo)     │ ◀── │  Node.js + Express    │ ◀── │  NASA FIRMS (satelital) │
│                  │     │  Módulo de reglas de  │     │  Clima (fase posterior)  │
│                  │     │  priorización         │     │  Cámaras (fase posterior)│
└──────────────┘     └─────────┬─────────┘     └─────────────────────┘
                                 │
                                 ▼
                       ┌───────────────────┐
                       │ PostgreSQL + PostGIS │
                       │ (señales, bitácora,   │
                       │ verificaciones)        │
                       └───────────────────┘
```

| Incremento | Qué se agregaría |
|---|---|
| 2 | Backend en Node.js/Express; conexión real a NASA FIRMS; base de datos PostgreSQL + PostGIS; persistencia de las decisiones de verificación. |
| 3 | Módulo de reglas de priorización con clima, cobertura vegetal y cercanía a población; posible extracción como microservicio. |
| 4 | Pasarela de cámaras autorizadas (RTSP → WebRTC/HLS), roles y auditoría de accesos. |

Este documento se actualizará a medida que cada incremento pase de "planeado" a "implementado".
