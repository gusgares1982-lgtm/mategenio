# P0 — Rediseño integral: primera aventura que de verdad apetezca jugar

## Decisión del propietario (3 noviembre 2026)
El juego actual ha sido probado y rechazado: apariencia amateur, poca diversión y ejercicios demasiado simples. **No añadir más preguntas ni mundos sobre la experiencia actual.** Prioridad absoluta: reconstruir un vertical slice jugable y excelente, antes de expandir contenido. Esto sustituye la priorización anterior de más mundos y monetización.

## Objetivo
Una aventura autocontenida de 8–12 minutos para niños de aproximadamente 7–10 años (con entrada de dificultad ajustable), disfrutable en Safari/iPad táctil. La matemática debe ser una herramienta para actuar sobre el mundo, no una ficha de opción múltiple. Mantener sin anuncios, sin cuentas infantiles y sin recogida de datos.

## Propuesta de primera aventura: «El faro de las luciérnagas»
Niko llega a un bosque nocturno cuyo faro está apagado. Hay que recuperar tres cristales para iluminarlo. Tres escenas distintas, cada una con una mecánica física y un cambio visual en el mundo:
1. **Puente de troncos**: colocar/arrastrar tramos de longitud correcta para cruzar un arroyo. Estimación, sumas y descomposición de cantidades; dificultad parametrizable, no una respuesta fija.
2. **Jardín de luz**: organizar luciérnagas en grupos y patrones; manipulación directa, agrupación y secuencias con varias soluciones aceptables cuando proceda.
3. **Faro**: distribuir energía entre tres haces de luz con una suma objetivo; resolver con distintas combinaciones y observar el faro encenderse en una animación final.

## Diseño y juego
- Dirección visual coherente, ilustración vectorial original de calidad, paleta nocturna cálida, profundidad en capas, composición a pantalla completa, tipografía legible y pocos controles; no interfaz corporativa ni páginas de texto.
- Niko debe reaccionar a acciones, dudas y logros; animaciones suaves de entrada, feedback inmediato y efectos de sonido opcionales, respetando reduced-motion y silencio.
- El niño interactúa principalmente con el escenario mediante tocar, arrastrar o colocar. En cada escena debe ocurrir algo visible cuando acierta. Errores recuperables, sin cronómetros ni vidas.
- Instrucciones breves y reproducibles por voz; ayuda escalonada y accesible, controles alternativos a drag, objetivos táctiles cómodos.
- Rejugabilidad: al menos 5 variantes válidas por escena, objetivos y disposición diferentes; no resolver siempre las mismas seis respuestas.
- Adaptación mínima y explícita: dos o tres niveles de reto según aciertos/ayudas, con límites pedagógicos verificables. No afirmar IA adaptativa.
- Entrada directa a jugar en <= 2 toques, sin introducir formularios ni marketing.

## Entregables verificables
1. Vertical slice completo en rama propia, con cambios reales en código y recursos visuales.
2. URL jugable de **preview independiente**, accesible en Safari/iPad sin instalar nada, sin sobrescribir la versión pública.
3. Tests de reglas y generación de variantes (incluyendo ausencia de estados irresolubles), navegación, persistencia y controles táctiles/teclado.
4. Capturas y revisión visual a 768x1024 y 1024x768; no afirmar test real de Safari sin haberlo ejecutado.
5. Sesión observacional con niños antes de expandir: ¿entienden qué hacer?, ¿se divierten?, ¿piden repetir?, ¿se atascan?
6. Mantener el juego anterior disponible como legacy y no romper progreso previo.

## No hacer
No construir más páginas de documentación como sustituto del juego. No abrir cuentas, pagos ni telemetría infantil. No publicar en main sin pruebas y verificación de preview. No atribuir a Codex trabajo no confirmado.

## Coordinación Codex/ChatGPT
**Esta issue es la especificación P0 de producto.** Codex debe leerla al empezar cada iteración, comentar qué parte implementa y enlazar commits/PR. ChatGPT revisará contra estos criterios; cualquier decisión nueva del propietario se registrará aquí o en issues vinculadas. PR #3/#4 de infraestructura son secundarios frente a esta experiencia.
