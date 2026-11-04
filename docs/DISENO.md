# Sistema de diseño · Senderos de Numeria

## Dirección

Un cuento de exploración: papel cálido, bosque geométrico, caminos tranquilos. Niko es un zorro con pañuelo verde. `assets/forest.svg` e `icon.svg` son ilustraciones propias del proyecto; no se descargan recursos de terceros. La ilustración principal define los futuros mundos: formas simples, profundidad en tres planos, paleta limitada, una luz cálida.

## Tokens

| Token CSS | Valor | Uso |
| --- | --- | --- |
| ink | #233e35 | Titulares y texto |
| muted | #53665c | Texto secundario |
| pine | #245b4a | Acciones primarias |
| paper | #faf9f5 | Fondo |
| sage | #e8eddf | Superficies de ayuda |
| gold | #f0c77a | Detalles y recompensa |
| line | #dedfd5 | Separadores decorativos |
| radius | 28px | Superficies principales |
| shadow | 0 16px 48px #223d3410 | Elevación suave |

Espaciado: base de 4px, separación entre módulos 18–32px, márgenes de página 18/28/48px. Georgia para títulos narrativos; tipografía del sistema para instrucciones, controles y números. Sin fuentes remotas. Títulos adaptables de 32 a 70px; instrucciones del juego 18–23px.

## Componentes

- Header con marca, navegación y acciones familiares. Controles semánticos con nombre accesible.
- WorldCard: disponible con acción real o próximo contenido sin botón falso.
- Guide: Niko y lectura opcional del reto; la instrucción siempre está escrita.
- Activity: enunciado, objetos, ayuda, feedback y continuación explícita.
- Basket: añadir o quitar objetos por toque o teclado; no exige arrastre preciso.
- Glade y Number: elección con estado `aria-pressed`, borde y fondo distinguibles.
- Feedback: estado vivo con texto, sin depender solo del color; errores sin penalización.
- Dialog: modal nativo con foco contenido, Escape y salida visible.
- Progress y Reward: progreso narrativo, sin cuenta atrás ni comparación social.

## Calidad y accesibilidad

Objetivos: controles de al menos 44px, foco visible, ausencia de scroll horizontal a 390/834/1194px, texto principal con contraste WCAG AA, reducción de movimiento, sonido desactivado inicialmente. Separadores no transmiten información por sí solos. Las manzanas, luciérnagas, Niko e iconos del juego son SVG originales y no dependen de emoji del sistema. La práctica clásica conserva su apariencia anterior.

La lectura usa `speechSynthesis`; depende de las voces instaladas y puede necesitar conexión según el sistema. No es un audio pregrabado ni se promete voz offline. Pendientes pruebas reales con VoiceOver, niños que no leen y Safari en iPad.


## Revisión de acabado · 3 de noviembre de 2026

La portada presenta una aventura real y un sendero de seis paradas calculado desde el progreso guardado. La parada actual permite continuar y las completadas se identifican por texto y marca de verificación. Se retiran las tarjetas de mundos futuros para centrar la entrada en contenido jugable.

La escena de picnic separa manzanas disponibles y recogidas en dos superficies. Cada manzana es un botón con nombre accesible; los ajustes +/− se conservan como alternativa. El toque mueve una unidad, sin precisión de arrastre ni temporizador. El marco, el enunciado, el contador vivo y los botones de ajuste se mantienen montados al manipular objetos. Las animaciones son breves y se anulan con reducción de movimiento.

Las pistas muestran agrupaciones distintas según el concepto: 3+2, siete con tres tachadas, tres parejas, cantidades comparadas y saltos +2. Se recuperan al volver a abrir la sesión. Los iconos SVG tienen tamaño y trazo compartidos. En 320px la escena se apila para mantener controles de 44px; entre 390px y escritorio se muestran las dos superficies juntas.
