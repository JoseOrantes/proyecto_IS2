# Guía de los presentadores: CRM AutoVentas GT, S. A.

**Segunda entrega: Puntos 9 al 15**
**Duración máxima:** 20 minutos
**Docente:** Ing. Raúl Hernández Reyna

---

## 1. Roles del equipo

| Integrante | Carné | Responsabilidad en la exposición |
|------------|-------|----------------------------------|
| Antony David Sequen Monroy | 202300922 | Portada, problema, riesgos y cierre. |
| Pedro Andrés Pereda Arriola | 202404706 | Triple restricción, cambios, uso de IA y pruebas. |
| José Armando Orantes Bolaños | 202407391 | Arquitectura, seguridad, demostración en vivo y lecciones. |

> Propuesta de reparto. Ajustar según la disponibilidad del equipo.

---

## 2. Distribución de tiempo

| Minutos | Sección | Diapositivas | Expositor |
|---------|---------|--------------|-----------|
| 0 a 1 | Portada y agenda | 1 y 2 | Antony |
| 1 a 3 | Problema | 3 | Antony |
| 3 a 6 | Riesgos y triple restricción | 4 y 5 | Antony y Pedro |
| 6 a 8 | Uso de la IA | 6 | Pedro |
| 8 a 11 | Arquitectura y seguridad | 7 y 8 | José |
| 11 a 16 | Demostración del MVP | 9 a 14 | José (Pedro apoya con el navegador) |
| 16 a 18 | Calidad y pruebas | 15 | Pedro |
| 18 a 20 | Lecciones y cierre | 16 y 17 | Antony |

---

## 3. Guion por diapositiva

### Diapositiva 1: Portada

**Tiempo:** 1 min · **Expositor:** Antony

**Guion de exposición:** "Buen día, ingeniero Raúl Hernández y compañeros. Somos Antony Sequen, Pedro Pereda y José Orantes. Hoy presentamos la segunda entrega del Sistema CRM para AutoVentas GT, S. A., correspondiente a los puntos 9 al 15 del curso de Ingeniería de Software II. Esta presentación se basa en el documento de entrega y en las capturas del sistema funcionando."

**Autopregunta del expositor:** "¿Qué diferencia hay entre esta entrega y la primera? La primera definió el alcance, el presupuesto y el backlog. Esta segunda muestra el sistema funcionando, los riesgos, la calidad y el control de cambios."

### Diapositiva 2: Agenda

**Tiempo:** 0 min (incluido en la portada) · **Expositor:** Antony

**Guion de exposición:** "Vamos a recorrer el problema del negocio, los riesgos y el control de cambios, el uso de la inteligencia artificial, la arquitectura y la seguridad, una demostración en vivo del sistema y, por último, las pruebas y lo que aprendimos."

**Autopregunta del expositor:** "¿Por qué mostramos la demostración después de la arquitectura? Porque así el público entiende qué hay detrás de cada pantalla antes de verla funcionar."

### Diapositiva 3: Problema de AutoVentas GT

**Tiempo:** 2 min · **Expositor:** Antony

**Guion de exposición:** "AutoVentas GT maneja sus clientes e inventario en hojas de cálculo y documentos separados. Esto provoca pérdida de oportunidades y datos duplicados, y no permite dar seguimiento desde que un prospecto muestra interés hasta que compra. Nuestro CRM reúne clientes, prospectos, vehículos, cotizaciones, usuarios y reportes en un solo sistema."

**Autopregunta del expositor:** "¿Qué es un prospecto y en qué se diferencia de un cliente? Un prospecto es alguien que mostró interés en un vehículo. Se convierte en cliente cuando avanza en el proceso y concreta una compra."

### Diapositiva 4: Gestión de riesgos

**Tiempo:** 1.5 min · **Expositor:** Antony

**Guion de exposición:** "Identificamos riesgos técnicos, humanos, operativos y de inteligencia artificial. El de mayor criticidad es el código generado por IA con errores, con un valor de 9. Este riesgo se materializó: un cambio en las vistas PHP dejó la página de prospectos sin cargar. Lo corregimos y lo registramos como evidencia. Los riesgos de disponibilidad del equipo y de cambios de alcance tienen criticidad 6 y se revisan en cada sprint."

**Autopregunta del expositor:** "¿Por qué calculamos la criticidad como probabilidad por impacto? Permite priorizar. Un riesgo con probabilidad alta y impacto alto se atiende primero, aunque haya otros que también preocupen."

### Diapositiva 5: Triple restricción y gestión de cambios

**Tiempo:** 2.5 min · **Expositor:** Pedro

**Guion de exposición:** "La línea base es de 15 historias de usuario y 61 story points, 16 semanas en 8 sprints y 384 horas-hombre, de las cuales 38 son de contingencia. Cualquier cambio sigue el mismo flujo: solicitud, evaluación, aprobación, implementación y cierre. En esta entrega aprobamos seis cambios: eliminar solo para el administrador con confirmación, Bootstrap para la interfaz, CRUD completo, sesión que vence tras 5 minutos de inactividad, respuestas HTTP estándar y la imagen de fondo del login."

**Autopregunta del expositor:** "¿Qué pasa con el costo si se agrega una historia de usuario? Se usa parte de la contingencia. Si el cambio afecta el calendario, también se necesita tiempo adicional, y por eso evaluamos cada cambio con el proceso."

### Diapositiva 6: Uso de la IA y registro de prompts

**Tiempo:** 2 min · **Expositor:** Pedro

**Guion de exposición:** "Usamos inteligencia artificial para generar código, vistas, documentación e imágenes. Cada respuesta la tratamos como una propuesta: la ejecutamos y revisamos el resultado. Un ejemplo es el error de sintaxis en prospectos: la IA lo introdujo y el equipo lo detectó al cargar la página. Todos los prompts y sus correcciones están en el registro de prompts."

**Autopregunta del expositor:** "¿Qué hacemos cuando la IA propone un comando que no existe? Lo comprobamos en la máquina del equipo, buscamos la alternativa correcta y dejamos el caso en el registro."

### Diapositiva 7: Arquitectura

**Tiempo:** 1.5 min · **Expositor:** José

**Guion de exposición:** "El frontend está hecho en PHP y usa Bootstrap 5 de forma local. Los estilos están en la carpeta css y los scripts en la carpeta js. El backend está en Node.js con Express y se divide en rutas, controladores, servicios y repositorios, según el principio de responsabilidad única. La base de datos es MariaDB. El frontend no consulta la base de datos: todo pasa por la API REST."

**Autopregunta del expositor:** "¿Por qué separar el backend en capas? Si cambia la forma de guardar datos, solo cambia el repositorio. Las reglas de negocio quedan en los servicios y no se repiten en las rutas."

### Diapositiva 8: Seguridad

**Tiempo:** 1.5 min · **Expositor:** José

**Guion de exposición:** "Las contraseñas se guardan con bcrypt y 12 rondas. El acceso a la API está limitado a los orígenes definidos en CORS. Cada ruta valida el token y el rol. La sesión del frontend vence después de 5 minutos sin actividad. Los errores devuelven mensajes estándar y no muestran detalles internos del servidor. Eliminar y editar están limitados al administrador. El módulo de usuarios solo se muestra y se abre para el administrador, aunque se escriba la URL."

**Autopregunta del expositor:** "¿Por qué el archivo .htaccess no protege en el servidor de desarrollo? El servidor integrado de PHP no lee el archivo .htaccess. En Apache o LiteSpeed, como en Hostinger, sí se aplica."

### Diapositiva 9: Demostración: inicio de sesión

**Tiempo:** 1 min · **Expositor:** José

**Guion de exposición:** "Esta es la pantalla de acceso. El fondo muestra un predio de vehículos con vidrio y áreas verdes, y el formulario queda por encima. Mostraré el acceso con el usuario administrador."

**Autopregunta del expositor:** "¿Qué pasa si una sesión queda inactiva? Después de 5 minutos el sistema cierra la sesión y pide iniciar de nuevo."

### Diapositiva 10: Demostración: dashboard

**Tiempo:** 1 min · **Expositor:** José

**Guion de exposición:** "El dashboard resume el estado del negocio y da acceso a cada módulo."

**Autopregunta del expositor:** "¿Qué datos aparecen aquí? Son datos ficticios cargados para la demostración. No hay datos reales de clientes."

### Diapositiva 11: Demostración: clientes y prospectos

**Tiempo:** 2 min · **Expositor:** José

**Guion de exposición:** "En clientes podemos crear, consultar y editar. Eliminar solo lo puede hacer el administrador, y el sistema pide confirmación antes de borrar. Los prospectos siguen el mismo patrón y se pueden convertir en clientes."

**Autopregunta del expositor:** "¿Por qué pedimos confirmación antes de eliminar? Evita borrados accidentales. La confirmación se muestra con una ventana moderna de Bootstrap, no con el mensaje nativo del navegador."

### Diapositiva 12: Demostración: catálogo y cotizaciones

**Tiempo:** 2 min · **Expositor:** José

**Guion de exposición:** "En el catálogo se consultan los vehículos por tipo. En cotizaciones, el botón Eliminar aparece a la izquierda de Aprobar. Cuando el descuento supera el límite, la cotización queda pendiente y el gerente la aprueba."

**Autopregunta del expositor:** "¿Cómo se calculan los totales? El servicio de cotizaciones calcula subtotal, descuento e IVA en un solo lugar, para que el resultado sea el mismo en todas las pantallas."

### Diapositiva 13: Catálogo de vehículos

**Tiempo:** 1 min · **Expositor:** Pedro

**Guion de exposición:** "Estas son las imágenes de los tipos de vehículo del catálogo. Son ilustrativas y generadas con inteligencia artificial. Cada una se revisó visualmente, y aclaramos en la documentación que no representan modelos reales (riesgo R-13)."

**Autopregunta del expositor:** "¿Las imágenes representan modelos reales? No. Son ilustrativas. El documento lo aclara para no inducir a error."

### Diapositiva 14: Demostración: usuarios y roles

**Tiempo:** 1 min · **Expositor:** José

**Guion de exposición:** "El módulo de usuarios solo lo ve el administrador. Para demostrarlo, entramos con el usuario Vendedor: la pestaña Usuarios no aparece en el menú, y si escribimos la dirección `index.php?page=usuarios` en el navegador, el sistema nos lleva al inicio sin mostrar el módulo. Después volvemos con el Admin. Desde aquí se crean usuarios, se asignan roles y se desactivan. Un usuario con registros asociados no se puede eliminar; en ese caso se desactiva."

**Autopregunta del expositor:** "¿Basta con ocultar la pestaña? No. La pestaña solo es comodidad visual. La validación real está en el servidor del frontend y en la API, que responde 403 a cualquier rol no autorizado."

**Autopregunta del expositor:** "¿Por qué no se puede eliminar un usuario con registros? Porque se perderían cotizaciones y prospectos ligados a él. Desactivarlo conserva el historial."

### Diapositiva 15: Calidad y pruebas

**Tiempo:** 2 min · **Expositor:** Pedro

**Guion de exposición:** "Probamos la API con peticiones directas. Las pruebas cubrieron inicio de sesión, conversión de prospectos, aprobación de descuentos, reportes y restricciones por rol. En la interfaz probamos el alta, la consulta y la eliminación de un cliente de prueba. Lo que falta es automatizar las pruebas, probar el vencimiento de la sesión y ejecutar el análisis estático."

**Autopregunta del expositor:** "¿Qué significa que una prueba esté pendiente? Que todavía no la hemos ejecutado. Lo decimos abiertamente en el documento y lo incluimos en la siguiente entrega."

### Diapositiva 16: Lecciones aprendidas

**Tiempo:** 1.5 min · **Expositor:** Antony

**Guion de exposición:** "Lo que funcionó fue separar el backend en capas y probar la API antes de construir la interfaz. Lo que no funcionó fue depender de respuestas de IA sin verificarlas: algunos errores de sintaxis llegaron hasta la página. Para la siguiente etapa completaremos las pruebas automatizadas y el análisis estático."

**Autopregunta del expositor:** "¿Qué cambiaríamos en el proceso? Pedir cambios más pequeños y ejecutar la prueba inmediatamente después de cada uno."

### Diapositiva 17: Cierre

**Tiempo:** 0.5 min · **Expositor:** Antony

**Guion de exposición:** "Gracias por su atención. Estamos listos para responder preguntas sobre el sistema, el proceso o las decisiones técnicas."

**Autopregunta del expositor:** "¿Qué pregunta es probable en esta sección? ¿Qué pasó con las imágenes de vehículos? Respondemos que son ilustrativas, generadas con IA, y que el documento lo aclara."

---

## 4. Preparación antes de la presentación

- Levantar la API con `npm start` desde `back_end` y el frontend con `php -S localhost:8080` desde `front_end`.
- Tener los tres usuarios de demostración listos (Admin, Gerente y Vendedor).
- Tener las capturas de respaldo de `capturas/` abiertas en caso de fallo.
- Si la sesión vence durante la demostración, volver a iniciar sesión.
- Revisar esta guía al menos una vez antes de presentarla.
