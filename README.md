# Ojo Verde — Prototipo académico

Prototipo web responsive para monitorear y verificar señales satelitales de posibles
focos de calor en Colombia. Todos los datos son **simulados** en memoria: no hay APIs,
claves, cámaras ni integraciones externas. Las alertas requieren verificación humana.

---

## Opción A — Verlo ya (sin instalar nada)

El sitio ya está compilado y es 100% estático. Solo se necesita Python:

```bash
cd ojo-verde
python -m http.server 8000
```

Abre en el navegador: **http://localhost:8000**

Notas:
- Las tipografías (DM Sans, Manrope, IBM Plex Mono) se cargan de Google Fonts, así que
  la primera vez se necesita internet. Sin internet el sitio funciona igual, con la
  fuente del sistema.
- Sirve la carpeta completa (`ojo-verde`), no solo el `index.html`, porque el sitio
  carga sus archivos desde `assets/`.

En Windows puede ser `py -m http.server 8000` si el comando `python` no existe.

## Opción B — Ver y modificar el código

La carpeta `codigo-fuente/` contiene el proyecto completo (React + TypeScript + Tailwind):

```bash
cd codigo-fuente
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Cualquier cambio en `codigo-fuente/src/` se ve al
instante en el navegador. Para volver a generar el sitio estático: `npm run build`.

---

## Dónde está cada cosa

| Archivo | Qué contiene |
|---|---|
| `codigo-fuente/src/routes/index.tsx` | Toda la pantalla: tarjetas de resumen, mapa, filtros, lista de alertas, ficha de detalle y sección "Cómo funciona" |
| `codigo-fuente/src/routes/index.tsx` (arriba) | Los datos simulados: 5 alertas (OV-260921-084, -079, -067, -052, -041) de Cundinamarca, Santander, Meta y La Guajira, con prioridad, estado, confianza y factores |
| `codigo-fuente/src/styles.css` | Sistema visual: colores (azul oscuro, verde bosque, rojo/naranja/amarillo), sombras y clases del mapa |
| `codigo-fuente/src/routes/__root.tsx` | Metadatos del sitio y las tipografías |
| `index.html` + `assets/` | El sitio ya compilado que sirve `python -m http.server` |

## Cómo funciona la lógica (para el informe)

1. Los datos son un arreglo de objetos en memoria (sin base de datos).
2. Los filtros (departamento, prioridad, estado) recalculan la lista con `useMemo`.
3. Seleccionar una alerta guarda su `id` en el estado; la ficha de detalle la muestra.
4. El selector de estado escribe en un borrador; "Guardar decisión" confirma el cambio
   y muestra el aviso de que la decisión final pertenece al operador humano.
5. El estado guardado vive solo durante la sesión (al recargar, vuelve al inicio).

## Aviso académico

Este prototipo es un ejercicio de diseño e interacción. Una señal satelital **no**
confirma un incendio: toda decisión requiere verificación humana en territorio.
