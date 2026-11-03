# Construir la primera aventura del Bosque de Numeria

La experiencia anterior era un cuestionario monolítico sin checkpoint ni instalación offline. Esta entrega permite completar una aventura de seis escenas con Niko, manipular objetos, pedir ayuda, pausar y continuar tras recargar, y encontrar un tesoro sin penalizar los errores.

Incluye identidad visual e ilustraciones propias, módulos de actividades y persistencia, PWA sin dependencias, zona familiar con barrera aritmética, resultados por competencia, exportación y ajustes de accesibilidad. La práctica anterior permanece íntegra y conserva sus estrellas.

## Validación

- Nueve pruebas de lógica aprobadas (`node tests/engine.test.js`).
- Chromium/Playwright: partida completa, reintentos, ayuda, checkpoint, recompensa, panel familiar, descarga, preferencias y recarga offline; tamaños 1194×834, 834×1194 y 390×844; sin errores JS ni scroll horizontal; controles visibles >=44px.
- Resiliencia: confirmación/cancelación del borrado, guardado corrupto y respaldo, foco con teclado y almacenamiento indisponible.
- Contraste sRGB de combinaciones principales >=4,5:1; revisión visual de capturas; sintaxis y diff sin errores.

## Límites y revisión

No se ha probado Safari ni un iPad físico; pendientes VoiceOver y validación con familias. Voz y emoji dependen del sistema. No hay adaptación pedagógica, perfiles, sincronización, pagos ni declaración de cumplimiento jurídico. Son fases siguientes documentadas, no funciones simuladas.

Sitio estático apto para un subdirectorio de GitHub Pages. No añade automatización de despliegue ni publica producción. Revisar diseño, explicaciones pedagógicas y privacidad antes de aprobar. Documentación completa en `docs/`.
