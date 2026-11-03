# Arquitectura, decisiones y privacidad

Aplicación estática sin framework ni proceso de build. Rutas relativas compatibles con GitHub Pages. `app.js` controla vistas y eventos; `engine.js` describe las misiones y calcula resultados/recomendación; `storage.js` valida y persiste; `styles.css` contiene tokens y componentes. Ningún secreto o código de servidor.

## Persistencia

Clave nueva `mategenio-v2`, esquema 2. Se guardan misiones completadas, último número de intentos/uso de ayuda por competencia, checkpoint (escena, objetos, intentos, ayuda y resolución) y preferencias. Sin nombre, cumpleaños, email, reloj de reacción, identificadores remotos o analítica. La clave clásica `mategenio-save` se conserva; solo se leen sus estrellas cuando no existe un guardado nuevo. Valores inesperados se filtran; JSON corrupto o versión desconocida se avisa y se conserva en `mategenio-v2-recovery` antes de la próxima escritura. Si no se puede escribir, se informa y se mantiene la sesión en memoria. El usuario puede exportar JSON, pero aún no reimportarlo desde la interfaz.

Borrar progreso elimina los resultados de la aventura mediante un nuevo estado vacío, conservando la práctica clásica. Para eliminar también cualquier copia de recuperación y estrellas clásicas, borrar los datos del sitio en el navegador. Un futuro borrado integral deberá cubrir todas las versiones y copias explícitamente.

El adaptador de almacenamiento permite sustituir localStorage por un repositorio sincronizado en el futuro. No se afirma que exista sincronización: actualmente otro dispositivo, otro navegador o borrar datos del sitio implica otro progreso. Ediciones simultáneas en varias pestañas no se fusionan; gana la última escritura.

## Decisiones pedagógicas automáticas actuales

Seis misiones fijas, en orden. Se comprueba igualdad con la solución definida. Al segundo intento se ofrece la explicación explícita; una pista solicitada se registra. Una competencia se marca explorada cuando se resuelve; cada resolución actualiza su último resultado, sin historial por sesión. La recomendación familiar selecciona la primera competencia con pista o más de un intento; si no existe, propone contar cubiertos. No hay adaptación de dificultad, repaso espaciado, evaluación inicial ni inferencia de dominio en esta fase.

## Offline y seguridad

Service worker con lista cerrada de recursos locales. Cachea solo el sitio y sirve esos recursos offline después de la primera instalación completa. Cache con versión; activación estándar sin `skipWaiting` para no mezclar sesiones existentes con módulos nuevos. No hay llamadas a API, scripts remotos, anuncios ni cookies de seguimiento. El service worker requiere HTTPS o localhost. El alojamiento puede registrar peticiones HTTP: revisar política y retención del proveedor antes del lanzamiento.

La barrera aritmética no impide que quien conoce el dispositivo entre. No protege secretos; solo separa acciones de adulto. Los datos locales y las exportaciones son accesibles para quien controle el navegador. No se declara cumplimiento RGPD. Antes de comercializar: revisión jurídica sobre datos de menores, bases legales y consentimiento, avisos de privacidad, contratos de encargados, conservación/borrado y distribución/cobros. La voz es una función del navegador: revisar comportamiento y proveedor del dispositivo antes de prometer procesamiento local.
