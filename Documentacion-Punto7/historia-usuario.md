# Historia de usuario — Ojo Verde

## Historia principal

> Como operador del Cuerpo de Bomberos o de una Corporación Autónoma Regional (CAR), quiero visualizar en un mapa 3D las señales recientes de posibles focos de calor y su contexto de riesgo, para decidir cuáles debo verificar primero y apoyar una respuesta temprana.

## Criterios de aceptación

- El sistema muestra las señales disponibles e informa fuente, hora de observación y hora de última consulta; la frecuencia visible depende de la disponibilidad de la fuente satelital.
- Cada foco de calor muestra ubicación, nivel de confianza del dato satelital y hora de detección.
- En una fase posterior, el operador autorizado puede consultar una cámara cercana si existe cobertura, autorización institucional y una pasarela segura de video.
- El sistema genera una alerta priorizada cuando un foco de calor coincide con zonas de alta densidad de vegetación seca o cercanía a poblaciones.
- Ninguna señal se presenta como incendio confirmado: toda alerta requiere verificación humana registrada.

## Historias secundarias (incrementos futuros)

- Como analista ambiental, quiero consultar el histórico de focos de calor de una región para identificar patrones estacionales.
- Como brigadista, quiero recibir la ruta de acceso más eficiente hacia el foco activo desde mi ubicación actual.

## Definición de "hecho" para esta historia

- [ ] Las señales mostradas incluyen fuente, hora de observación y confianza.
- [ ] El operador puede registrar un estado de verificación por señal (verificado / descartado / pendiente).
- [ ] La priorización (alta/media/baja) es explicable: se muestran los factores que la determinan.
- [ ] Ningún texto de la interfaz afirma un incendio confirmado a partir de una sola señal satelital.
