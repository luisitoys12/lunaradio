# Instrucciones de la versión

## Cambios realizados en esta versión
- Se actualizó la configuración principal del reproductor para apuntar al stream de LibreTime/Icecast en `http://209.182.217.136:8000/main`.
- Se actualizó la URL de metadatos a `http://209.182.217.136:8000/status-json.xsl`.
- Se removió la portada/logo externo anterior en el reproductor principal (coverimage vacío) y se reemplazó el fondo por un degradado neutro.
- Se normalizó branding básico del `index.html` a "LibreTime Radio" (título, descripción y keywords).
- Se adaptó `js/script.js` para consumir metadatos nativos de Icecast (`icestats.source`) y parsear `artista - canción` desde `title`.

## Requisitos o dependencias nuevas
- No se agregaron dependencias nuevas.
- Se requiere que el servidor Icecast exponga `status-json.xsl` y el mountpoint `/main`.

## Guía paso a paso para probar la funcionalidad
1. Inicia un servidor web local en la raíz del proyecto:
   ```bash
   python3 -m http.server 4173
   ```
2. Abre el reproductor principal:
   - `http://127.0.0.1:4173/index.html`
3. Verifica:
   - El stream reproduce desde `http://209.182.217.136:8000/main`.
   - El título en reproducción cambia con metadatos de `status-json.xsl`.
   - Ya no aparece la portada/logo anterior en el reproductor principal.
4. (Opcional) Abrir la consola del navegador y revisar que no existan errores de red/CORS relacionados con `status-json.xsl`.
