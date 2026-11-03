# MateGenio · El bosque de Numeria

Una primera aventura matemática para explorar, manipular y compartir. Para niños de 5 a 8 años, con acompañamiento familiar. Sin dependencias de producción, anuncios, cuentas ni pagos.

## Desarrollo

Requisitos: Python 3 para servir archivos y Node 18+ para pruebas de lógica. Sin instalación de paquetes.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node tests/engine.test.js
```

El servidor se ejecuta desde la raíz del repositorio. Abrir el puerto local en el navegador de desarrollo. Los módulos JavaScript y el service worker requieren HTTP local o HTTPS; no abrir directamente `index.html` desde el sistema de archivos.

Prueba de navegador: con Python Playwright y Chromium instalados, y el servidor activo, ejecutar `python3 tests/browser.py`. Usa `/usr/bin/chromium` y escribe capturas fuera del repositorio, en `/workspace/artifacts`. No modifica el progreso de un navegador personal. Regenera los iconos PNG desde el SVG original.

## Entrega

- Seis escenas: conteo, suma, comparación, resta, series y reparto mediante objetos.
- Niko, mapa, ayudas visuales, lectura con voz del sistema cuando esté disponible, sonido opcional, tesoro final.
- Checkpoint por acción y progreso local versionado, exportación y borrado desde una zona familiar con barrera aritmética.
- Caché offline e instalación PWA. En Safari: compartir → añadir a pantalla de inicio. Requiere una primera carga completa con conexión y HTTPS (localhost se admite en desarrollo).
- Práctica anterior conservada íntegra en `practica.html`, accesible desde Familias. Sus estrellas no se borran ni se convierten en competencias dominadas.

No se ha publicado esta entrega. Es compatible con alojamiento estático bajo un subdirectorio de GitHub Pages; no hay un workflow de despliegue automático. Publicar solo después de aprobación. Las actualizaciones del service worker esperan al cierre de las pestañas existentes; incrementar su versión al cambiar el contenido cacheado.

Ver [auditoría y alcance](docs/PRODUCTO.md), [sistema de diseño](docs/DISENO.md), [arquitectura y privacidad](docs/ARQUITECTURA.md) y [validación](docs/VALIDACION.md).
