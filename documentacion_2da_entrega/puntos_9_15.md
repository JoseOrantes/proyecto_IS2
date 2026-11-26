## Índice de contenido

Introducción

9. Gestión de riesgos
10. Gestión de la triple restricción
11. Gestión de cambios
12. Calidad
13. Producto mínimo viable (MVP)
14. Lecciones aprendidas
15. Presentación final

Conclusiones

Referencias

## Introducción

Este documento presenta la segunda entrega del proyecto del semestre de Ingeniería de Software II. El proyecto consiste en desarrollar un sistema de gestión de relaciones con clientes (CRM) para AutoVentas GT, S. A., una empresa dedicada a la venta de vehículos nuevos y usados, bajo el enfoque de ingeniería de software asistida por inteligencia artificial (IA), tal como lo define el enunciado del curso.

El objetivo general del proyecto es aprender a desarrollar software recorriendo las etapas del ciclo de vida, con la IA colaborando en cada una de ellas. Según el enunciado, la IA no sustituye las decisiones del equipo: todas las propuestas generadas por la IA deben ser evaluadas, validadas y justificadas por los estudiantes. El proyecto no busca un producto comercial terminado, sino aplicar correctamente el proceso de desarrollo y demostrarlo con evidencia.

La segunda entrega corresponde a los puntos 9 al 15 del enunciado: gestión de riesgos, gestión de la triple restricción (alcance, tiempo y costo), gestión de cambios, calidad, producto mínimo viable, lecciones aprendidas y presentación final. Cada sección describe las decisiones tomadas, la evidencia del uso de IA y los ajustes que el equipo realizó sobre los resultados generados.

El documento se organiza en las secciones 9 a 15, seguidas de las conclusiones y las referencias. El código fuente y el ejecutable se entregan por separado, junto con la presentación de 20 minutos.

---

## 9. Gestión de riesgos

Este apartado identifica los riesgos del proyecto en cuatro categorías: técnicos, humanos, operativos y los asociados al uso de inteligencia artificial (IA). Para cada riesgo se estima la probabilidad y el impacto en una escala de 1 (bajo) a 3 (alto). La criticidad se calcula como Probabilidad × Impacto y se revisa en cada sprint.

### 9.1 Registro de riesgos

**Tabla 1**

*Registro de riesgos del proyecto*

| ID | Tipo | Riesgo | Prob. | Impacto | Criticidad | Mitigación | Contingencia |
|----|------|--------|:-----:|:-------:|:----------:|------------|--------------|
| R-01 | Técnico | Extensión de PHP no instalada (cURL). El login devuelve error 500 porque `curl_init()` no existe. | 3 | 2 | 6 | Lista de requisitos de entorno en el README (PHP con cURL, Node.js y MariaDB). | Instalar `php-curl` y reiniciar el servidor PHP. |
| R-02 | Técnico | Exposición de credenciales (contraseña de base de datos o secretos de la aplicación) en el repositorio. | 1 | 3 | 3 | Archivo `.env` excluido por `.gitignore`. Contraseñas de usuario con bcrypt. Secretos generados con valores aleatorios. | Rotar credenciales y secretos, y revisar el historial del repositorio. |
| R-03 | Técnico | Conflicto de puertos. El puerto 3000 lo usa Grafana en el equipo de desarrollo. | 3 | 1 | 3 | Puerto configurable con la variable `PORT` en `.env`. Se usa el puerto 3001. | Cambiar `PORT` y actualizar la URL de la API en el frontend. |
| R-04 | Técnico | Diferencias entre el entorno local y el de despliegue (AWS o Hostinger) en CORS y en la conexión a la base de datos. | 2 | 2 | 4 | Orígenes CORS definidos por variable de entorno (`CORS_ORIGINS`). Configuración de base de datos por variables. | Ajustar variables de entorno en el servidor de despliegue. |
| R-05 | Humano | Disponibilidad irregular de los integrantes por cargas académicas. | 2 | 3 | 6 | Asignar HU por integrante y revisar avances en reuniones semanales. | Mover HU Should o Could al siguiente sprint. Las HU Must se mantienen. |
| R-06 | Humano | Nivel desigual en Node.js y PHP entre los integrantes. | 2 | 2 | 4 | Revisiones cruzadas de código y documentación de la arquitectura. | Sesiones de apoyo entre compañeros y revisión del código en pareja. |
| R-07 | Operativo | Subestimación del esfuerzo en historias grandes (HU-10 con 8 SP). | 2 | 2 | 4 | Estimación con Fibonacci. Reserva de 38 HH de contingencia (ver punto 10). | Dividir la HU en subtareas y reestimar en la planificación del sprint. |
| R-08 | Operativo | Error en el cálculo de totales de cotización (subtotal, descuento, IVA). | 1 | 3 | 3 | Cálculo centralizado en el servicio de cotizaciones y pruebas de los casos con y sin descuento. | Corregir el servicio y repetir las pruebas de regresión. |
| R-09 | Operativo | Cambios de alcance solicitados durante el desarrollo. | 3 | 2 | 6 | Proceso formal de gestión de cambios (punto 11). | Evaluar el impacto y aplazar el cambio a una versión posterior si afecta el MVP. |
| R-10 | IA | El código generado por IA contiene errores de sintaxis, rutas inexistentes o supuestos incorrectos sobre el entorno. | 3 | 3 | 9 | Revisión humana de cada cambio, verificación en ejecución y prompts de corrección documentados. | Revertir el cambio, corregir el archivo y registrar el error en el registro de prompts. |
| R-11 | IA | Dependencia excesiva de la IA y pérdida de comprensión del código por parte del equipo. | 2 | 2 | 4 | Cada integrante explica los módulos que revisa. El equipo documenta las decisiones de diseño. | Sesiones de explicación del código antes de la presentación. |
| R-12 | IA | Envío de datos sensibles (contraseñas, secretos o datos reales de clientes) a la herramienta de IA. | 2 | 3 | 6 | Regla del equipo: no enviar contraseñas, tokens ni datos personales reales. Solo se usan datos ficticios. | Rotar el secreto expuesto y eliminar el mensaje o la sesión afectada. |
| R-13 | IA | Imágenes de vehículos generadas por IA que no representan fielmente los modelos (por ejemplo, el camión estilo HINO). | 2 | 1 | 2 | Revisión visual de cada imagen y aclaración en la documentación de que son ilustrativas. | Regenerar la imagen con un prompt más específico. |

> Nota: la criticidad se calcula con la fórmula Probabilidad × Impacto. Valores de 6 o más se consideran críticos y requieren seguimiento en cada sprint.

### 9.2 Riesgos críticos y seguimiento

Los riesgos R-05, R-09 y R-10 son los de mayor criticidad. R-10 ya se materializó durante el desarrollo: un cambio en las vistas PHP introdujo un error de sintaxis (una cadena cerrada antes de tiempo) que impidió cargar la página de prospectos. Se corrigió y el caso quedó registrado en el registro de prompts.

---

## 10. Gestión de la triple restricción

La triple restricción relaciona alcance, tiempo y costo. Un cambio en cualquiera de ellos afecta a los otros dos. La calidad se trata como una cuarta variable que no debe sacrificarse para cumplir las otras tres.

### 10.1 Línea base del proyecto

**Tabla 2**

*Línea base de la triple restricción*

| Restricción | Línea base | Fuente |
|-------------|-----------|--------|
| Alcance | 15 HU, 61 SP. MVP con 9 HU Must (35 SP), 4 HU Should (18 SP), 1 HU Could (3 SP) y 1 HU Won't (5 SP). | Product backlog v1.0 |
| Tiempo | 16 semanas, 8 sprints de 2 semanas. | Primera entrega, punto 8 |
| Costo | 384 HH (3 integrantes × 8 HH semanales × 16 semanas). 346 HH planificadas y 38 HH de contingencia. | Primera entrega, presupuesto |

### 10.2 Efecto de los cambios sobre la triple restricción

**Tabla 3**

*Efecto de los escenarios de cambio sobre la triple restricción*

| Escenario de cambio | Alcance | Tiempo | Costo | Decisión |
|---------------------|---------|--------|-------|----------|
| Incluir HU-03 (historial de llamadas y visitas, 5 SP) en la versión 1. | Aumenta 5 SP. | Requiere cerca de un sprint adicional si la velocidad promedio es de unos 7 SP por sprint. | Usa parte de la contingencia (38 HH). | Rechazar. Se mantiene como Won't para proteger el calendario. |
| Reducir el alcance quitando HU-12 y HU-13 (reportes, 10 SP). | Disminuye 10 SP. | Libera cerca de 1 sprint. | Libera HH del equipo para pruebas. | Aceptar solo si el calendario se compromete. Se recomienda antes de recortar HU Must. |
| Retraso de una semana por falta de disponibilidad de un integrante (riesgo R-05). | Sin cambio. | Aumenta una semana. | Aumenta cerca de 24 HH (3 personas × 8 HH). Se cubre con la contingencia. | Aceptar y reasignar HU Should. |
| Cambio del requisito de descuentos (límite de aprobación del gerente). | Afecta HU-10 (8 SP). | Puede agregar medio sprint. | Agrega esfuerzo de pruebas. | Evaluar en el proceso de cambios (punto 11). |

> Nota: la velocidad de 7 SP por sprint es un supuesto de planificación (61 SP entre 8 sprints). Se reemplazará por la velocidad real del equipo.

---

## 11. Gestión de cambios

Todo cambio al alcance, al calendario o a los requisitos sigue el mismo flujo. El proceso evita cambios no controlados y deja trazabilidad.

### 11.1 Flujo del proceso

**Tabla 4**

*Etapas del proceso de gestión de cambios*

| Etapa | Responsable | Descripción | Salida |
|-------|-------------|-------------|--------|
| 1. Solicitud | Cualquier integrante o el cliente representado | Se registra la solicitud con descripción, motivo y prioridad. | Solicitud de cambio (CR-xx). |
| 2. Evaluación | Equipo de desarrollo | Se analiza el efecto sobre la triple restricción, las HU afectadas, los riesgos (punto 9) y las pruebas necesarias. | Informe de impacto con SP y HH estimados. |
| 3. Aprobación | Equipo, y el cliente representado en los cambios de alcance | Se acepta, se rechaza o se aplaza el cambio. Los cambios aceptados se incorporan al backlog. | Decisión registrada con fecha. |
| 4. Implementación | Integrante asignado | Se desarrolla el cambio, se prueba y se documenta. | Código revisado y documentación actualizada. |
| 5. Cierre | Equipo | Se verifica el cambio contra los criterios de aceptación y se actualiza el registro. | Cambio cerrado en el registro. |

### 11.2 Registro de cambios

**Tabla 5**

*Registro de solicitudes de cambio*

| ID | Solicitud | Motivo | Impacto | Decisión |
|----|-----------|--------|---------|----------|
| CR-01 | Corregir la numeración de HU y los SP de la sección 8 de la primera entrega. | Inconsistencias entre el backlog y la planificación. | Sin cambio de alcance. Solo corrige la documentación. | Aprobado. Aplicado. |
| CR-02 | Cambiar el puerto de la API de 3000 a 3001. | El puerto 3000 lo usa Grafana (R-03). | Solo configuración en `.env` y en la URL del frontend. | Aprobado e implementado. |
| CR-03 | Separar los estilos CSS y el JavaScript del código PHP, en carpetas propias. | Requisito de estructura y mantenibilidad. | Cambio en las vistas y nuevas carpetas `css/` y `js/`. | Aprobado e implementado. |
| CR-04 | Agregar confirmaciones con JavaScript (cerrar sesión, conversión, aprobación y credenciales incorrectas). | Mejorar la experiencia y evitar acciones accidentales. | Cambio en la interfaz. No afecta la API. | Aprobado e implementado. |
| CR-05 | Permitir eliminar solo al rol Administrador, con confirmación previa en el navegador. | Control de acceso y prevención de borrados accidentales. | Restricción de `DELETE` por rol en la API. Botón Eliminar visible solo para Admin. | Aprobado e implementado. |
| CR-06 | Usar Bootstrap 5.0.2 local para estilos y componentes. Ventanas modales en lugar de `alert()` y `confirm()`. | Reducir CSS propio y usar componentes modernos. | Bootstrap en `front_end/` y modales de confirmación en `js/app.js`. | Aprobado e implementado. |
| CR-07 | Crear, consultar, editar y eliminar en todos los módulos. Solo Admin puede editar y eliminar. | Requisito de CRUD completo con control de roles. | Rutas `PUT` y `DELETE` en la API y formularios Editar en el frontend. | Aprobado e implementado. |
| CR-08 | Cerrar la sesión del frontend tras 5 minutos de inactividad. | Requisito de seguridad sobre sesiones. | Constante `SESION_INACTIVIDAD_SEGUNDOS = 300` en `db.php` y control en `index.php`. | Aprobado e implementado. Prueba de vencimiento en navegador pendiente. |
| CR-09 | Respuestas HTTP estándar del servidor (400, 401, 403, 404, 405, 409, 500, 501, 502, 503). | Respuestas uniformes y sin filtrar detalles internos. | Mapa de mensajes en `errorHandler.js`. Los errores 5xx se registran en consola y el cliente recibe un mensaje genérico. | Aprobado e implementado. |
| CR-10 | Imagen de fondo para la pantalla de inicio de sesión (predio de vehículos con vidrio, árboles y arbustos). | Requisito visual del login. | Nuevo archivo `front_end/imagenes/login-predio.png` y estilo en `css/app.css`. | Aprobado e implementado. |
| CR-11 | Solo el Admin ve la pestaña Usuarios y no puede acceder a ella escribiendo la URL (`?page=usuarios`). | Control de acceso por rol en la interfaz, además de la API. | En `index.php`, la lista `PAGINAS` oculta la pestaña a los roles no permitidos y el enrutador muestra el dashboard si el rol no tiene acceso a la página solicitada. | Aprobado e implementado. Prueba en navegador con Gerente y Vendedor pendiente. |

---

## 12. Calidad

La calidad se aplica en cuatro niveles: revisión de código, análisis estático, pruebas y validación del contenido generado por IA. También se consideran los controles de seguridad del sistema.

### 12.1 Revisiones de código

Cada cambio se revisa antes de considerarse terminado. La revisión verifica el principio de responsabilidad única (SRP), el uso correcto de CORS, el hash de contraseñas con bcrypt y que el código no contenga CSS ni JavaScript incrustados.

Se revisan los nombres de variables y funciones, el manejo de errores y que no existan secretos en el código.

Las revisiones se registran con el hallazgo, la corrección y la fecha.

### 12.2 Análisis estático

**Estado: planificado.** No se ha ejecutado todavía una herramienta de análisis estático sobre el código del proyecto.

- **Backend (Node.js):** ESLint para detectar errores y malas prácticas. SonarQube Community Edition para métricas de calidad, duplicación y vulnerabilidades.
- **Frontend (PHP):** PHP_CodeSniffer para el estilo de código y PHPStan para el análisis de tipos y errores.

Los resultados se documentarán en la tercera entrega, junto con las métricas de cumplimiento.

### 12.3 Pruebas

#### 12.3.1 Pruebas funcionales de la API

Se realizaron pruebas funcionales de la API con peticiones HTTP (cURL) sobre el backend levantado en el puerto 3001.

**Tabla 6**

*Pruebas funcionales de la API*

| Caso de prueba | Resultado esperado | Resultado |
|----------------|--------------------|-----------|
| Inicio de sesión con credenciales válidas | Token y datos del usuario. | Aprobado. |
| Consulta del catálogo de vehículos | Lista de vehículos y tipos. | Aprobado. |
| Creación de cliente y de prospecto | Registro creado. | Aprobado. |
| Conversión de prospecto en cliente | Cliente creado a partir del prospecto. | Aprobado. |
| Cotización con descuento mayor al límite | Cotización en estado Pendiente. | Aprobado. |
| Aprobación de descuento por gerente | Cotización aprobada. | Aprobado. |
| Reportes de embudo y ventas | Totales por etapa y por vendedor. | Aprobado. |
| Restricción de acceso por rol (por ejemplo, vendedor en reportes o usuarios) | Respuesta 403. | Aprobado. |

Después de las pruebas se eliminaron los registros de prueba de la base de datos.

#### 12.3.2 Pruebas de la interfaz y de la segunda entrega

**Tabla 7**

*Pruebas de la interfaz y de la segunda entrega*

| Caso de prueba | Resultado esperado | Resultado |
|----------------|--------------------|-----------|
| Alta y eliminación de un cliente de prueba desde la interfaz | El cliente aparece en la lista y después se elimina. | Aprobado. Registro de prueba eliminado. |
| Botón Eliminar visible solo para Admin | Vendedor y Gerente no ven el botón. | Pendiente de verificar con los tres roles. |
| Ventana de confirmación antes de eliminar | La acción se ejecuta solo al confirmar. | Aprobado al cancelar. La opción Aceptar no se probó para evitar borrar datos de demostración. |
| Pantalla de inicio de sesión con imagen de fondo | El card de login queda sobre la imagen. | Aprobado. Captura en el navegador. |
| Datos de demostración en el dashboard y en los módulos | Los datos aparecen en cada página. | Aprobado. Capturas en `capturas/`. |

#### 12.3.3 Pruebas pendientes

- Pruebas automatizadas (unitarias y de integración) para la API y el frontend.
- Prueba de vencimiento real de la sesión tras 5 minutos de inactividad en el navegador.
- Verificación de las respuestas HTTP estándar con el backend reiniciado.

### 12.4 Defectos detectados

**Tabla 8**

*Defectos detectados durante el desarrollo*

| ID | Defecto | Origen | Corrección |
|----|---------|--------|------------|
| D-01 | Error 500 por falta de la extensión cURL en PHP. | Entorno. | Instalar `php-curl`. |
| D-02 | Error de sintaxis en `prospectos.php` y `cotizaciones.php` al agregar el atributo de confirmación. | Cambio asistido por IA. | Se eliminó una comilla de más. Se registró el caso. |
| D-03 | Puerto 3000 ocupado por otro servicio. | Entorno. | Se usa el puerto 3001 (CR-02). |

### 12.5 Validación del contenido generado por IA

- Cada respuesta de la IA se trata como una propuesta que debe verificarse antes de usarse.
- Se ejecuta el código o la consulta y se revisa el resultado. Un cambio no se da por bueno si solo parece correcto.
- Los supuestos sobre el entorno (rutas, comandos, puertos y extensiones) se comprueban en la máquina del equipo.
- Las afirmaciones de la documentación se contrastan con la fuente: el enunciado del proyecto, el backlog y el código.
- Los errores y las correcciones se documentan en el registro de prompts.

### 12.6 Controles de seguridad

**Tabla 9**

*Controles de seguridad implementados*

| Control | Implementación | Estado |
|---------|----------------|--------|
| Contraseñas | Hash con bcrypt (Provos y Mazières, 1999). El costo por defecto es 12 rondas (variable `BCRYPT_ROUNDS`). Si el usuario no existe, se compara contra un hash ficticio para no revelar qué correos están registrados. | Implementado. |
| Arquitectura por endpoints | El frontend PHP no consulta la base de datos. Todo acceso pasa por la API REST. | Implementado. |
| Consultas en capa de servicios | Las consultas viven en la capa de servicios del backend. Las páginas de usuario no contienen SQL. | Implementado. |
| CORS | Solo se aceptan los orígenes definidos en `CORS_ORIGINS`. Por defecto, `http://localhost:8080`. | Implementado. |
| Autenticación y autorización | Las rutas usan los middlewares `authenticate` y `authorize`. Usuarios: solo Admin, tanto en la API como en la interfaz (la pestaña se oculta y la URL directa redirige al dashboard). Reportes: Admin y Gerente. Cotizaciones: Admin, Gerente y Vendedor, con aprobación solo para Admin y Gerente. Eliminar y editar: solo Admin. | Implementado. |
| Sesión del frontend | Sesión PHP con identificador de sesión. Vence tras 5 minutos de inactividad. | Implementado. Prueba de vencimiento pendiente. |
| Protección de carpetas | `front_end/.htaccess` restringe el acceso a carpetas internas en Apache o LiteSpeed (Hostinger). El servidor integrado `php -S` no lee `.htaccess`. | Implementado. Aplica solo en Apache o LiteSpeed. |
| Respuestas de error | Mensajes estándar por código HTTP. Los errores 5xx no exponen detalles internos. | Implementado. |
| Registro de accesos | Los intentos de inicio de sesión se guardan en la tabla `auth_log`. | Implementado. |
| Control de versiones | El archivo `.env` no se sube al repositorio. | Implementado. |

### 12.7 Roles y permisos

**Tabla 10**

*Permisos por rol para cada módulo y acción*

| Módulo o acción | Admin | Gerente | Vendedor |
|-----------------|:-----:|:-------:|:--------:|
| Inicio, clientes, prospectos, vehículos y cotizaciones (consulta y alta) | Sí | Sí | Sí |
| Editar y eliminar en cualquier módulo | Sí | No | No |
| Aprobar descuentos de cotización | Sí | Sí | No |
| Reportes de embudo y ventas por vendedor | Sí | Sí | No |
| Usuarios (pestaña, URL directa y API) | Sí | No | No |
| Crear vehículos | Sí | Sí | Sí |

La restricción se aplica en la API con los middlewares `authenticate` y `authorize`, y en la interfaz con la lista `PAGINAS` de `front_end/index.php`. La fila de crear vehículos refleja el comportamiento actual del código. Está pendiente decidir si esa acción se restringe a Admin.

---

## 13. Producto mínimo viable (MVP)

El MVP cubre los módulos indispensables para operar el CRM. La tabla indica el estado real de cada HU al cierre de esta entrega.

### 13.1 Estado de las historias de usuario

**Tabla 11**

*Estado de las historias de usuario al cierre de la entrega*

| HU | Historia | Prioridad | SP | Estado | Evidencia o pendiente |
|----|----------|-----------|----|--------|-----------------------|
| HU-01 | Registrar cliente | Must | 3 | Implementada (API y vista). | Alta, consulta, edición y eliminación (solo Admin). Validación de duplicados por NIT o DPI pendiente de verificar. |
| HU-02 | Buscar y consultar clientes | Must | 2 | Parcial. | Consulta por ID y listado. Búsqueda parcial y paginación pendientes. |
| HU-03 | Historial de llamadas y visitas | Won't | 5 | Fuera de la versión 1. | Documentado como mejora posterior. |
| HU-04 | Registrar prospecto | Must | 3 | Implementada. | Alta de prospectos con origen y vehículo de interés. Edición y eliminación (solo Admin). |
| HU-05 | Asignar prospecto a vendedor | Must | 3 | Parcial. | Actualización de prospectos disponible. Restricción por rol y bitácora de asignaciones pendientes de verificar. |
| HU-06 | Mover prospecto entre etapas | Must | 5 | Parcial. | Actualización de etapa disponible. Validación de transiciones y motivo de pérdida pendientes. |
| HU-07 | Convertir prospecto en cliente | Should | 3 | Implementada. | Endpoint de conversión. Se probó con éxito. |
| HU-08 | Registrar vehículos en catálogo | Must | 3 | Implementada (API y vista). | Alta, edición y eliminación. Edición y eliminación solo para Admin. El alta (`POST`) está abierta a cualquier usuario autenticado; decisión pendiente de revisar. |
| HU-09 | Consultar catálogo con filtros | Must | 3 | Parcial. | Listado, detalle y tipos. Filtros combinables pendientes. |
| HU-10 | Crear cotización | Must | 8 | Implementada. | Cálculo de subtotal, descuento e IVA. Aprobación de descuentos por gerente. Edición y eliminación (solo Admin). Reserva de vehículo pendiente. |
| HU-11 | Generar PDF de cotización | Should | 5 | No implementada. | Pendiente para la tercera entrega. |
| HU-12 | Reporte de embudo | Should | 5 | Implementada (API). | Conteo y monto por etapa. Filtros por período y vendedor pendientes. |
| HU-13 | Reporte de ventas por vendedor | Should | 5 | Implementada (API). | Monto por vendedor. Comparativo por período pendiente. |
| HU-14 | Crear usuarios y asignar roles | Must | 5 | Implementada. | Alta, consulta, edición y eliminación. Solo Admin. Hash con bcrypt. Desactivación desde la edición (campo activo). Eliminar un usuario con registros asociados responde 409 y sugiere desactivarlo. |
| HU-15 | Exportar reportes a Excel | Could | 3 | No implementada. | Fuera del MVP. |

### 13.2 Resumen del MVP

- Todas las HU Must tienen al menos una parte implementada.
- Las HU Must con pendientes (HU-02, HU-05, HU-06 y HU-09) son las prioridades para completar antes de la presentación final.
- Las HU Should y Could sin implementar (HU-11 y HU-15) se documentan como trabajo posterior.

### 13.3 Arquitectura

- **Backend:** Node.js (OpenJS Foundation, s. f.-b) con Express (OpenJS Foundation, s. f.-a). Capas separadas en rutas, controladores, servicios y repositorios (principio de responsabilidad única). Base de datos MariaDB (MariaDB Foundation, s. f.). Puerto 3001.
- **Frontend:** PHP (PHP Documentation Group, s. f.). Consume la API con cURL. Bootstrap 5.0.2 local (Bootstrap, s. f.). Estilos en `css/` y scripts en `js/`.
- **Comunicación:** API REST en formato JSON, con token de sesión y CORS restringido por variable de entorno.
- **Respuestas de error:** mensajes estándar por código HTTP (400, 401, 403, 404, 405, 409, 500, 501, 502, 503).

---

## 14. Lecciones aprendidas

### 14.1 Qué funcionó

- Separar el backend en capas facilitó localizar y corregir errores sin afectar otros módulos.
- Las pruebas de la API con peticiones directas permitieron validar reglas de negocio y de roles antes de construir la interfaz.
- La configuración por variables de entorno permitió resolver conflictos de puerto sin cambiar el código.
- El proceso de cambios dejó registro de decisiones, como la corrección de la sección 8 y la separación de CSS y JavaScript.
- Pedir cambios en pasos pequeños y probar cada uno permitió detectar errores de sintaxis en la misma sesión.

### 14.2 Qué no funcionó

- Algunos cambios asistidos por IA introdujeron errores de sintaxis que no se detectaron hasta cargar la página.
- Las instrucciones de ejecución asumieron un script `dev` que no existía en el proyecto. Esto generó confusión al levantar el backend.
- Faltó verificar la extensión cURL de PHP antes de ejecutar la interfaz.

### 14.3 Beneficios del uso de IA

- Acelera la redacción de código repetitivo, como las rutas, los controladores y las vistas.
- Ayuda a comparar alternativas de diseño y a detectar problemas de seguridad comunes.
- Permite generar prototipos visuales (imágenes de vehículos, fondo de login y diagramas) con rapidez.

### 14.4 Limitaciones de la IA

- Puede proponer comandos, rutas o nombres de scripts que no existen en el proyecto.
- No conoce el estado actual de los archivos a menos que se le proporcione. Puede sobrescribir o romper código existente.
- Las imágenes generadas pueden no representar fielmente los modelos reales.
- Sus respuestas deben verificarse, porque pueden parecer correctas sin serlo.

### 14.5 Recomendaciones para la siguiente etapa

- Verificar el entorno (versión de PHP, extensiones y puertos) antes de cada sesión de trabajo.
- Pedir a la IA cambios pequeños y verificables, y ejecutar la prueba inmediatamente después.
- Completar las pruebas automatizadas, la prueba de vencimiento de sesión y el análisis estático antes de la tercera entrega.
- Decidir si el alta de vehículos debe ser solo para Admin.

---

## 15. Presentación final

La presentación tiene una duración máxima de 20 minutos. La distribución propuesta es la siguiente:

**Tabla 12**

*Distribución propuesta de la presentación de 20 minutos*

| Minutos | Sección | Contenido | Evidencia |
|---------|---------|-----------|-----------|
| 0 a 2 | Problema | Situación actual de AutoVentas GT y necesidad del CRM. | Casos de uso (primera entrega). |
| 2 a 5 | Proceso | Metodología ágil, sprints, backlog y roles. | Backlog y planificación. |
| 5 a 8 | Evidencia de IA | Uso de la IA, prompts principales, errores detectados y correcciones. | Registro de prompts. |
| 8 a 11 | Arquitectura | Backend en Node.js, frontend en PHP, MariaDB, CORS, bcrypt, roles y seguridad de sesión. | Diagrama de arquitectura. |
| 11 a 16 | MVP | Demostración: login, clientes, prospectos, catálogo, cotizaciones, usuarios y reportes. | Capturas de pantalla e imágenes de vehículos. |
| 16 a 18 | Riesgos y calidad | Riesgos críticos, pruebas realizadas y plan de análisis estático. | Registro de riesgos y tabla de pruebas. |
| 18 a 20 | Lecciones y cierre | Lo aprendido, limitaciones de la IA y próximos pasos. | Resumen de lecciones. |

### 15.1 Preparación de la demostración

- Levantar la API con `npm start` desde la carpeta `back_end` y el frontend con `php -S localhost:8080` desde la carpeta `front_end`.
- Tener preparados datos de prueba ficticios y los tres usuarios de demostración (Admin, Gerente y Vendedor).
- Tener una captura de respaldo de cada módulo en caso de fallo de red o de servicio.
- Las capturas están en la carpeta `capturas/` y las imágenes de vehículos en `imagenes_vehiculos/`.

---

## Conclusiones

El desarrollo del CRM confirma que la IA acelera el trabajo, pero no reemplaza el criterio del equipo. Durante la segunda entrega, la IA propuso código, estructuras, rutas y supuestos sobre el entorno. Cuando las instrucciones eran precisas y se verificaban en ejecución, el resultado fue útil. Cuando el equipo aceptó respuestas sin revisarlas, aparecieron errores de sintaxis, rutas inexistentes y comandos que no existían en el proyecto. Esto ocurrió en el riesgo R-10 de la sección 9.

La calidad del desarrollo depende de la calidad de los prompts. Un prompt correcto indica el contexto del proyecto, el alcance del cambio, las restricciones y la forma de comprobar el resultado. Por ello, el equipo registró los prompts, los errores encontrados y las correcciones. Esta práctica cumple la evidencia obligatoria de IA que pide el enunciado: herramienta, prompt, resultado, ajustes y justificación de la decisión final.

El enfoque de "vibe coding", que consiste en describir lo que se quiere en lenguaje natural y aceptar el código generado con poca revisión, es eficiente cuando el desarrollador tiene los conocimientos necesarios para evaluar lo que la IA produce. Con conocimiento de arquitectura, seguridad, bases de datos y pruebas, el equipo pudo detectar errores, corregirlos y justificar cada decisión. Sin esos conocimientos, la misma velocidad habría producido un sistema difícil de mantener y con fallas de seguridad no detectadas.

Los resultados principales de la segunda entrega son los siguientes:

- Se implementó el MVP con autenticación, control de acceso por roles y módulos de clientes, prospectos, vehículos, cotizaciones, usuarios y reportes.
- La arquitectura separa el frontend en PHP del backend en Node.js con Express y la base de datos en MariaDB, y todo el acceso a datos pasa por la API.
- Se gestionaron los riesgos, la triple restricción y los cambios con registros verificables.

Como pasos siguientes, el equipo debe completar las pruebas automatizadas, la prueba de vencimiento de sesión y el análisis estático. Cada decisión de IA que se incorpore debe seguir pasando por la verificación humana descrita en la sección 12.5.

## Referencias

Bootstrap. (s. f.). *Bootstrap 5 documentation*. https://getbootstrap.com/docs/5.0/

MariaDB Foundation. (s. f.). *MariaDB Knowledge Base*. https://mariadb.com/kb/

OpenJS Foundation. (s. f.-a). *Express: Fast, unopinionated, minimalist web framework for Node.js*. https://expressjs.com/

OpenJS Foundation. (s. f.-b). *Node.js documentation*. https://nodejs.org/docs/

PHP Documentation Group. (s. f.). *Manual de PHP*. https://www.php.net/manual/es/

Provos, N., y Mazières, D. (1999). A future-adaptive password scheme. En *Proceedings of the 1999 USENIX Annual Technical Conference, FREENIX Track*. USENIX Association.
