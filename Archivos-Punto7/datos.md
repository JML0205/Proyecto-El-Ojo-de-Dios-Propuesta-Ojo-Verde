# Datos — Ojo Verde

## Estado actual (Incremento 1)

Las 5 señales que se ven en el prototipo **no vienen de ninguna fuente externa**. Están escritas directamente en el código del frontend, en el arreglo `initialAlerts` de `src/routes/index.tsx`, con esta estructura por señal: ubicación, departamento, coordenadas, hora, antigüedad en minutos, prioridad, estado, nivel de confianza y factores (intensidad térmica, cercanía a bosque, temperatura, cercanía a población).

No hay ninguna llamada a una API, ni clave (`MAP_KEY`) configurada, ni base de datos. El propósito de esta etapa es validar el modelo de interacción (filtrar, priorizar, verificar) con datos de ejemplo realistas, antes de invertir en la integración real.

## Fuente planeada: NASA FIRMS (Incremento 2)

- **API:** Fire Information for Resource Management System (FIRMS).
- **Acceso:** requiere una `MAP_KEY` personal, solicitada en https://firms.modaps.eosdis.nasa.gov/api/map_key/.
- **Qué entregaría:** coordenadas del foco de calor detectado por sensores satelitales (ej. VIIRS, MODIS), hora de observación satelital y un nivel de confianza reportado por la propia fuente.
- **Limitaciones que el sistema deberá comunicar siempre, una vez integrada:**
  - La detección satelital identifica anomalías térmicas, no confirma un incendio en curso.
  - La frecuencia de paso del satélite limita qué tan "reciente" puede ser un dato — la interfaz deberá mostrar explícitamente la hora de observación y la hora de última consulta, nunca solo un estado genérico de "activo".
  - Nubosidad, humo denso o cobertura vegetal pueden ocultar o distorsionar una señal real.

## Datos climáticos y de cobertura vegetal (fase posterior, Incremento 3)

Se evaluará una fuente pública (ej. IDEAM u otro proveedor meteorológico) para cruzar cada señal con temperatura, viento y humedad. No se integrará hasta validar con operadores que la señal satelital + priorización básica ya aporta valor por sí sola.

## Principio de tratamiento de datos (vigente desde el Incremento 1)

Toda señal se presenta como **alerta por verificar**, nunca como hecho confirmado. Esto ya está implementado en la interfaz actual (aviso permanente y textos como "estimación simulada, no constituye confirmación") y debe mantenerse cuando los datos dejen de ser de ejemplo.
