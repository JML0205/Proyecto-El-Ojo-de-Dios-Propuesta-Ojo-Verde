# Seguridad — Ojo Verde

## Estado actual (Incremento 1)

En esta etapa **no hay ninguna credencial ni dato sensible que proteger**: el frontend no se conecta a ninguna API externa ni a ningún backend, y no maneja claves de ningún tipo. Las consideraciones de seguridad de este documento aplican a partir del Incremento 2, cuando se introduzcan el backend y las integraciones reales.

## Credenciales de APIs externas (a partir del Incremento 2)

- La `MAP_KEY` de NASA FIRMS se almacenará únicamente como variable de entorno del backend. El frontend no la recibirá ni la expondrá en el código del navegador.
- Toda consulta a fuentes externas (FIRMS, clima) pasará por el backend, que actuará como intermediario autenticado.

## Cámaras (Incremento 4 — fase posterior)

- Las cámaras se integrarán mediante una **pasarela de video** que convierta el stream RTSP original a WebRTC o HLS, de forma que el navegador nunca se conecte directamente al RTSP ni maneje sus credenciales.
- El acceso a una cámara requerirá:
  - Autorización institucional previa (convenio con el municipio, CAR o entidad propietaria de la cámara).
  - Rol de operador autorizado en el sistema (no todo usuario podrá ver todas las cámaras).
  - Registro en bitácora de cada acceso (quién, cuándo, a qué cámara).

## Roles (planeados desde el Incremento 2)

| Rol | Permisos |
|---|---|
| Operador | Ver señales, ver ficha de detalle, registrar verificación. |
| Coordinador | Todo lo anterior + ver histórico y métricas de la región. |
| Administrador | Gestión de usuarios, reglas de priorización y accesos a cámaras. |

Hoy el prototipo no diferencia roles: cualquiera que abra la página puede filtrar, seleccionar alertas y "guardar" una decisión (que solo vive en memoria del navegador).

## Trazabilidad (planeada)

A partir del Incremento 2, toda decisión registrada por un operador (verificado / descartado / pendiente) quedará con marca de tiempo y usuario en la base de datos, para poder auditar cómo se respondió a cada señal. Hoy esa decisión no se guarda de forma persistente.

## Principio general

Ningún componente del sistema tomará la decisión final por el operador, en ninguna etapa. El sistema prioriza y da contexto; la verificación y la decisión de movilizar recursos siempre es humana.
