# Validación de la entrega · 3 de noviembre de 2026

## Ejecutado

- `node tests/engine.test.js`: **9 pruebas**, todas aprobadas. Soluciones alcanzables, finalización idempotente, ayudas, checkpoint y ajustes, filtrado de estados, JSON corrupto, almacenamiento bloqueado, importación no destructiva de estrellas y copia de recuperación.
- `node --check src/app.js` y `git diff --check`: sin errores.
- `python3 tests/browser.py`: Chromium real en modo headless, interacción táctil emulada a 1194×834, 834×1194 y 390×844. Partida de seis escenas, respuesta errónea, pista, corrección, checkpoint tras recarga, recompensa, colección, barrera familiar (fallo y acierto), resumen, ajuste de texto y descarga de progreso. Recarga offline y comienzo de actividad sin red. Sin errores JavaScript de página, sin desbordamiento horizontal y controles de juego visibles de al menos 44px.
- `python3 tests/resilience.py`: confirmación/cancelación del borrado, JSON corrupto con respaldo, foco por teclado y almacenamiento inaccesible.
- Inspección visual de capturas de inicio y actividad. Iconos PNG generados del SVG propio. El paisaje se sirve localmente.
- Contrastes calculados con luminancia sRGB para las combinaciones principales de texto, acción y superficies. Un gris secundario inicialmente quedaba en 4,43:1 sobre salvia; se oscureció a #53665c para superar 4,5:1. No es una auditoría de accesibilidad completa.

Capturas de esta sesión disponibles en `/workspace/artifacts`: `mategenio-home.png`, `mategenio-adventure.png`, `mategenio-834.png`, `mategenio-390.png`.

## Límites de la evidencia

Chromium con viewport de iPad **no es Safari ni un iPad físico**. Pendientes Safari/iPad real, VoiceOver, instalación desde Safari, voces instaladas/offline, escucha de sonido, gestos reales, dispositivos modestos y sesiones con familias. La prueba automatizada verifica la API y los flujos, no la calidad subjetiva de los sonidos ni la comprensión infantil.

No hay suite preexistente. No hay evaluación de eficacia pedagógica, pruebas de pagos, infraestructura de cuentas o afirmación de cumplimiento jurídico. El contenido nuevo es fijo; la variedad aleatoria anterior se conserva en la práctica clásica. El cache offline se verifica para primera instalación y recarga, no para todas las migraciones futuras entre versiones publicadas.

## Revisión antes de lanzamiento

Revisión docente de retos y explicaciones; observación con familias; accesibilidad en dispositivos reales; política de privacidad del alojamiento; estrategia de actualizaciones PWA y recuperación de datos; revisión legal y operación antes de cobrar. No se ha desplegado a producción.
