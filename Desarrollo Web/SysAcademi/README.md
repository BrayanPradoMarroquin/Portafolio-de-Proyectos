# SysCademi - Sistema de Gestión Escolar

La creciente complejidad en la administración educativa exige soluciones tecnológicas robustas, escalables y adaptables. El presente proyecto consiste en el desarrollo de un Sistema de Gestión Escolar Integral, diseñado para optimizar los flujos de trabajo administrativos y académicos de las instituciones educativas. Para garantizar la independencia y evolución continua de sus funcionalidades, el sistema se estructura bajo una **arquitectura de microservicios**, desacoplando los seis módulos nucleares que rigen el ciclo académico: **Inscripciones, Pagos, Asignación de Grado, Gestión de Notas, Gestión de Cursos y Generación de Reportes**. Técnicamente, la solución se apoya en un backend basado en Node.js y TypeScript, lo que asegura alta concurrencia y tipado estático para reducir errores en tiempo de ejecución, mientras que el frontend desarrollado en React proporciona una interfaz dinámica, responsiva y de fácil interacción para los usuarios finales.

## Documentación de Requerimientos

### 1. Requerimientos Funcionales

#### Módulo de Autenticación y Roles
- **RF‑01**: El sistema debe permitir el inicio de sesión mediante correo electrónico y contraseña.
- **RF‑02**: El login debe validar el rol del usuario (Administración, Docente, Alumno, Padre de familia) y redirigir a su panel correspondiente.
- **RF‑03**: Los usuarios con rol **Administración** pueden crear, editar y deshabilitar cuentas de docentes, alumnos y padres.
- **RF‑04**: Los usuarios pueden recuperar su contraseña mediante un enlace enviado al correo registrado.

#### Módulo de Gestión Académica (Grados y Asignaturas)
- **RF‑05**: El sistema debe permitir la creación, edición y eliminación de **niveles** (Primaria, Básicos, Diversificado).
- **RF‑06**: Cada nivel puede contener varios **grados** (ej. 1º Primaria, 2º Básico, etc.).
- **RF‑07**: Cada grado puede tener asignaturas personalizables; el administrador puede agregar, modificar o eliminar asignaturas en cualquier momento.
- **RF‑08**: Las asignaturas se asocian a un grado específico y no pueden ser compartidas entre grados a menos que se configuren explícitamente.

#### Módulo de Inscripción de Alumnos
- **RF‑09**: El sistema permite inscribir un nuevo alumno registrando sus datos personales (nombre, apellido, fecha de nacimiento, DNI, dirección, teléfono, correo, etc.).
- **RF‑10**: Durante la inscripción, se debe asignar el alumno a un grado específico (de cualquier nivel).
- **RF‑11**: Es posible reasignar un alumno a otro grado en cualquier momento (cambio de grado), manteniendo el historial de notas y pagos.
- **RF‑12**: Cada alumno tiene un expediente que agrupa toda su información académica y financiera.

#### Módulo de Gestión de Notas y Actividades
- **RF‑13**: El sistema divide el año lectivo en **4 bimestres**.
- **RF‑14**: Para cada bimestre, el docente puede crear **actividades** (tareas, exámenes, proyectos, etc.) dentro de cada asignatura.
- **RF‑15**: Cada actividad tiene un nombre, descripción, fecha de entrega, porcentaje de ponderación y puntaje máximo.
- **RF‑16**: El docente puede registrar la nota obtenida por cada alumno en cada actividad, por bimestre.
- **RF‑17**: El sistema calcula automáticamente la nota final del bimestre para cada asignatura, según la ponderación de las actividades.
- **RF‑18**: Al finalizar los 4 bimestres, el sistema calcula el promedio final de cada asignatura (suma de notas bimestrales / 4) y lo muestra en la boleta.
- **RF‑19**: El sistema permite visualizar y exportar la boleta de notas de un alumno (PDF o impresión).

#### Módulo de Gestión de Pagos
- **RF‑20**: El sistema permite registrar pagos de matrícula, mensualidades y otros conceptos asociados a un alumno.
- **RF‑21**: Se puede consultar el historial de pagos de cada alumno, con fechas, montos y estados (pagado, pendiente, vencido).
- **RF‑22**: El sistema genera un recibo de pago en formato PDF para cada transacción.
- **RF‑23**: El administrador puede configurar conceptos de pago (matrícula, pensión, materiales, etc.) y sus montos por grado o nivel.

#### Módulo de Reportes Estadísticos
- **RF‑24**: El sistema genera reportes de rendimiento académico (promedios por grado, asignatura, bimestre).
- **RF‑25**: Se pueden filtrar reportes por nivel, grado, asignatura, bimestre o rango de fechas.
- **RF‑26**: Los reportes se pueden exportar en formatos CSV, Excel o PDF.
- **RF‑27**: El sistema muestra dashboards con gráficos (barras, líneas, pastel) para visualizar tendencias de notas, asistencia (si se implementa) y pagos.

#### Módulo de Roles y Vistas Personalizadas
- **RF‑28**: **Administración**: acceso total a todos los módulos (gestión de usuarios, académico, inscripciones, pagos, reportes).
- **RF‑29**: **Docente**: puede ver los alumnos de sus grados/asignaturas, registrar notas y actividades, ver reportes de su clase.
- **RF‑30**: **Alumno**: puede ver su propio expediente, notas por bimestre, boleta final y su historial de pagos (solo lectura).
- **RF‑31**: **Padre de familia**: puede ver la información de sus hijos (notas, boletas, pagos) pero no puede modificarla.

---

### 2. Requerimientos No Funcionales

- **RNF‑01 (Rendimiento)**: El sistema debe responder a las solicitudes en menos de 2 segundos en condiciones normales de carga (hasta 1000 usuarios concurrentes).
- **RNF‑02 (Escalabilidad)**: La arquitectura de microservicios debe permitir escalar horizontalmente los servicios más demandados (autenticación, académico, pagos).
- **RNF‑03 (Disponibilidad)**: El sistema debe tener una disponibilidad del 99.5% en horario escolar (7:00 am – 6:00 pm) y 98% fuera de ese horario.
- **RNF‑04 (Seguridad)**: Todas las comunicaciones deben estar cifradas mediante HTTPS. Las contraseñas se almacenan con hash (bcrypt) y se usa JWT con expiración corta (15 minutos) y refresh tokens.
- **RNF‑05 (Integridad de datos)**: Se deben implementar transacciones ACID en operaciones críticas (inscripción, registro de notas, pagos).
- **RNF‑06 (Respaldo)**: Se realizarán copias de seguridad automáticas de la base de datos cada 6 horas, con retención de 30 días.
- **RNF‑07 (Tecnologías)**: Backend con Node.js + TypeScript, Frontend con React, bases de datos relacionales (PostgreSQL) por microservicio, Docker, Kubernetes, CI/CD con GitHub Actions.
- **RNF‑08 (Logging y monitoreo)**: Todos los microservicios deben generar logs estructurados (JSON) y contar con métricas (Prometheus) y alertas (Grafana).
- **RNF‑09 (Mantenibilidad)**: El código debe seguir estándares ESLint/Prettier y tener una cobertura de pruebas unitarias e integración superior al 80%.
- **RNF‑10 (Usabilidad)**: La interfaz debe ser responsiva y accesible (WCAG 2.1 nivel AA), con mensajes de error claros y ayuda contextual.

---

### 3. Historias de Usuario

#### Administración
| ID   | Como...       | Quiero...                                                                 | Para...                                 |
|------|---------------|---------------------------------------------------------------------------|------------------------------------------|
| HU‑01| Administrador | gestionar (crear, editar, deshabilitar) cuentas de docentes, alumnos y padres | mantener el control de acceso al sistema |
| HU‑02| Administrador | configurar niveles, grados y asignaturas                                 | adaptar la oferta académica cada año     |
| HU‑03| Administrador | inscribir alumnos y asignarlos a un grado                                | mantener el registro de estudiantes      |
| HU‑04| Administrador | registrar pagos y generar recibos                                        | llevar un control financiero claro       |
| HU‑05| Administrador | visualizar reportes estadísticos de rendimiento y pagos                  | tomar decisiones basadas en datos        |
| HU‑06| Administrador | generar la boleta de notas de cualquier alumno                           | entregar documentos oficiales            |

#### Docente
| ID   | Como... | Quiero...                                                                 | Para...                                  |
|-------|---------|---------------------------------------------------------------------------|-------------------------------------------|
| HU‑07| Docente | ver la lista de alumnos de mis grados/asignaturas                        | conocer a mis estudiantes                 |
| HU‑08| Docente | crear actividades y ponderarlas por bimestre                             | planificar la evaluación                  |
| HU‑09| Docente | registrar las notas de cada alumno en cada actividad                     | calificar el desempeño                    |
| HU‑10| Docente | consultar el promedio bimestral y final de cada alumno                   | hacer seguimiento académico               |
| HU‑11| Docente | exportar reportes de mi clase (notas, promedios)                         | compartir información con coordinación    |

#### Alumno
| ID   | Como... | Quiero...                                                                 | Para...                                  |
|-------|---------|---------------------------------------------------------------------------|-------------------------------------------|
| HU‑12| Alumno  | ver mi expediente académico (datos personales, grado)                    | conocer mi situación actual               |
| HU‑13| Alumno  | consultar mis notas por bimestre y asignatura                           | saber mi rendimiento en cada materia      |
| HU‑14| Alumno  | ver mi boleta final con el promedio de cada asignatura                  | tener mi historial académico              |
| HU‑15| Alumno  | revisar mi historial de pagos                                           | llevar control de mis obligaciones        |

#### Padre de Familia
| ID   | Como...       | Quiero...                                                                 | Para...                                  |
|------|---------------|---------------------------------------------------------------------------|-------------------------------------------|
| HU‑16| Padre         | ver la información académica de mis hijos (notas, boletas)              | dar seguimiento a su educación            |
| HU‑17| Padre         | consultar el historial de pagos de mis hijos                            | gestionar los gastos escolares            |
| HU‑18| Padre         | recibir notificaciones (por correo) sobre bajas notas o pagos vencidos  | actuar a tiempo                           |

---

### 4. Casos de Uso

#### CU‑01: Iniciar sesión
- **Actor**: Administrador, Docente, Alumno, Padre  
- **Descripción**: El usuario ingresa su correo y contraseña para acceder al sistema.  
- **Flujo básico**:
  1. El usuario introduce credenciales.
  2. El sistema valida la existencia del usuario y la contraseña.
  3. El sistema genera un token JWT y lo envía al frontend.
  4. El usuario es redirigido a su panel según su rol.
- **Flujos alternativos**:
  - Credenciales incorrectas → mensaje de error.
  - Cuenta deshabilitada → mensaje de acceso denegado.

#### CU‑02: Gestionar usuarios (Administración)
- **Actor**: Administración  
- **Descripción**: Crear, editar o deshabilitar cuentas de docentes, alumnos y padres.  
- **Flujo básico**:
  1. El administrador selecciona "Usuarios".
  2. Elige la opción "Nuevo usuario", llena el formulario y asigna rol.
  3. El sistema guarda los datos y envía un correo con las credenciales temporales.
- **Flujos alternativos**:
  - Editar: modifica datos y guarda cambios.
  - Deshabilitar: cambia el estado a inactivo, impidiendo el acceso.

#### CU‑03: Configurar grados y asignaturas (Administración)
- **Actor**: Administración  
- **Descripción**: Crear niveles, grados y asignar asignaturas a cada grado.  
- **Flujo básico**:
  1. El administrador va a "Configuración académica".
  2. Agrega un nivel (ej. Primaria) y luego grados dentro de él.
  3. Para cada grado, agrega asignaturas con nombre y código.
  4. El sistema persiste la estructura.

#### CU‑04: Inscribir alumno
- **Actor**: Administración  
- **Descripción**: Registrar un nuevo alumno y asignarlo a un grado.  
- **Flujo básico**:
  1. El administrador selecciona "Inscripciones" → "Nuevo alumno".
  2. Completa los datos personales y elige el grado.
  3. El sistema crea el expediente del alumno y lo asocia al grado.
- **Flujos alternativos**:
  - Cambio de grado: se reasigna sin perder el historial.

#### CU‑05: Registrar actividades y notas (Docente)
- **Actor**: Docente  
- **Descripción**: Crear actividades para una asignatura/bimestre y calificar a los alumnos.  
- **Flujo básico**:
  1. El docente elige su asignatura y bimestre.
  2. Crea una actividad (nombre, fecha, ponderación, puntaje máximo).
  3. Luego ingresa las notas para cada alumno (o las importa desde un archivo).
  4. El sistema calcula automáticamente el promedio del bimestre.
- **Flujos alternativos**:
  - Editar actividad o nota ya registrada.
  - Eliminar actividad (con confirmación).

#### CU‑06: Calcular promedio final
- **Actor**: Sistema (automático)  
- **Descripción**: Al finalizar los 4 bimestres, el sistema calcula el promedio de cada asignatura.  
- **Flujo básico**:
  1. El sistema toma las notas de los 4 bimestres.
  2. Calcula la media aritmética por asignatura y la almacena.
  3. La boleta final mostrará este promedio.

#### CU‑07: Generar boleta de notas
- **Actor**: Administración, Docente, Alumno, Padre (según permisos)  
- **Descripción**: Visualizar y exportar la boleta de notas de un alumno.  
- **Flujo básico**:
  1. El usuario selecciona al alumno.
  2. El sistema muestra la boleta con notas bimestrales y promedios.
  3. El usuario puede exportar a PDF.

#### CU‑08: Registrar pago
- **Actor**: Administración  
- **Descripción**: Ingresar un pago de un alumno por un concepto específico.  
- **Flujo básico**:
  1. El administrador busca al alumno.
  2. Selecciona "Registrar pago", elige concepto, monto y fecha.
  3. El sistema genera un recibo y actualiza el estado de cuenta.

#### CU‑09: Generar reportes estadísticos
- **Actor**: Administración, Docente  
- **Descripción**: Obtener reportes de rendimiento académico o financiero con filtros.  
- **Flujo básico**:
  1. El usuario entra a "Reportes".
  2. Selecciona el tipo (notas, pagos), aplica filtros (grado, bimestre, etc.).
  3. El sistema muestra tablas y gráficos; permite exportar.

#### CU‑10: Ver perfil y expediente (Alumno/Padre)
- **Actor**: Alumno, Padre  
- **Descripción**: Consultar datos personales, notas y pagos (solo lectura).  
- **Flujo básico**:
  1. El usuario accede a su panel.
  2. Visualiza la información sin posibilidad de modificarla.

---
