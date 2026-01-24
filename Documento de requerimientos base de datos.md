\# 📄 DOCUMENTO DE REQUERIMIENTOS    
\#\# BASE DE DATOS – v1.3 FINAL    
\*\*(MariaDB \+ TypeORM)\*\*

\---

\#\# 0\. Estado del documento  
\*\*CONGELADO DEFINITIVO PARA DESARROLLO\*\*

Este documento integra todas las decisiones de producto y técnicas  
validadas.    
No se realizarán cambios estructurales adicionales en V1.

\---

\#\# 1\. Objetivo  
Definir la estructura final de la \*\*base de datos\*\* para una aplicación  
de gestión docente personal que permita:

\- Organización académica multi-nivel (primaria → universidad)  
\- Persistencia de alumnos  
\- Historial relevante y auditable  
\- Privacidad y consentimiento explícito  
\- Desarrollo estable con Angular \+ NestJS \+ TypeORM

\---

\#\# 2\. Principios de diseño

1\. Nada se elimina físicamente    
2\. El alumno es persistente    
3\. Separación estricta por contexto    
4\. Historial solo de información relevante    
5\. Privacidad primero    
6\. UX docente por encima de rigidez institucional    
7\. Validaciones críticas en backend    
8\. V1 sin monetización activa  

\---

\#\# 3\. Convenciones generales

\#\#\# 3.1 Estados  
Campo estándar \`status\`:  
\- \`active\`  
\- \`archived\`  
\- \`inactive\`

\#\#\# 3.2 Timestamps  
Todas las tablas incluyen:  
\- \`created\_at\`  
\- \`updated\_at\`

\---

\#\# 4\. Entidades del sistema

\---

\#\#\# 4.1 \`users\`  
\*\*Docentes\*\*

Campos:  
\- id (PK)  
\- email (UNIQUE)  
\- password  
\- name  
\- status  
\- created\_at  
\- updated\_at

\---

\#\#\# 4.2 \`contexts\`  
Entornos independientes de trabajo.

Campos:  
\- id (PK)  
\- user\_id (FK → users)  
\- name  
\- level  
\- institution (nullable)  
\- status  
\- created\_at  
\- updated\_at

\---

\#\#\# 4.3 \`academic\_periods\`  
Ciclos académicos.

Campos:  
\- id (PK)  
\- context\_id (FK → contexts)  
\- type (trimestre | cuatrimestre | semestre | anual)  
\- start\_date  
\- end\_date  
\- grace\_period\_days  
\- status  
\- created\_at  
\- updated\_at

Reglas:  
\- Solo un periodo activo por contexto  
\- No se permiten fechas solapadas  
\- Periodos archivados son solo lectura

\*\*Validación:\*\* Backend (NestJS)

\---

\#\#\# 4.4 \`groups\`  
Grupos o salones.

Campos:  
\- id (PK)  
\- academic\_period\_id (FK → academic\_periods)  
\- name  
\- status  
\- created\_at  
\- updated\_at

Restricción:  
\- UNIQUE(academic\_period\_id, name)

\---

\#\#\# 4.5 \`subjects\`  
Materias / asignaturas.

Campos:  
\- id (PK)  
\- group\_id (FK → groups)  
\- name  
\- is\_general (BOOLEAN, default TRUE)  
\- created\_at  
\- updated\_at

Creación automática:  
\- Al crear un grupo, el backend crea:  
  \- name \= 'General'  
  \- is\_general \= TRUE

No se usan triggers de BD.

\---

\#\#\# 4.6 \`students\`  
Alumno único y persistente.

Campos:  
\- id (PK)  
\- full\_name  
\- birth\_date (nullable)  
\- parent\_phone (nullable)  
\- notes (nullable)  
\- status  
\- created\_at  
\- updated\_at

Duplicados:  
\- Prevenidos mediante fuzzy matching en UI  
\- No existe identificador institucional obligatorio

\---

\#\#\# 4.7 \`student\_assignments\`  
Relación alumno ↔ grupo.

Campos:  
\- id (PK)  
\- student\_id (FK → students)  
\- group\_id (FK → groups)  
\- status  
\- assigned\_at  
\- created\_at  
\- updated\_at

Regla:  
\- Un alumno solo puede estar \*\*activo una vez\*\* en el mismo grupo

\*\*Validación:\*\* Backend (NestJS)

\---

\#\#\# 4.8 \`student\_assignment\_history\`  
Historial de asignaciones.

Campos:  
\- id (PK)  
\- student\_assignment\_id (FK)  
\- action (assigned | unassigned | reactivated)  
\- performed\_by (FK → users)  
\- performed\_at

\---

\#\#\# 4.9 \`attendance\`  
Asistencia.

Campos:  
\- id (PK)  
\- student\_assignment\_id (FK)  
\- subject\_id (FK → subjects)  
\- date  
\- status (present | absent | late)  
\- created\_at  
\- updated\_at

Índice:  
\- (student\_assignment\_id, date)

\---

\#\#\# 4.10 \`evaluation\_items\`  
Actividades evaluables.

Campos:  
\- id (PK)  
\- subject\_id (FK → subjects)  
\- academic\_period\_id (FK)  
\- name  
\- weight  
\- created\_at  
\- updated\_at

Reglas:  
\- weight entre 0 y 100  
\- Suma de pesos validada en UI (warning si ≠ 100\)

\---

\#\#\# 4.11 \`grades\`  
Calificaciones.

Campos:  
\- id (PK)  
\- evaluation\_item\_id (FK → evaluation\_items)  
\- student\_assignment\_id (FK)  
\- score  
\- created\_at  
\- updated\_at

Regla:  
\- Una calificación por alumno por actividad

Restricción:  
\- UNIQUE(evaluation\_item\_id, student\_assignment\_id)

\---

\#\#\# 4.12 \`student\_records\`  
Bitácora relevante del alumno.

Tipos:  
\- conducta  
\- tutoría  
\- médico  
\- cognitivo

Campos:  
\- id (PK)  
\- student\_id (FK)  
\- context\_id (FK)  
\- academic\_period\_id (FK, nullable)  
\- type  
\- description  
\- status  
\- created\_at  
\- updated\_at

\---

\#\#\# 4.13 \`student\_record\_replies\`  
Derecho de réplica.

Campos:  
\- id (PK)  
\- student\_record\_id (FK)  
\- reply\_text  
\- created\_at  
\- updated\_at

Alcance:  
\- Solo aplica a \`student\_records\`  
\- No aplica a calificaciones ni asistencia

\---

\#\#\# 4.14 \`files\`  
Archivos.

Campos:  
\- id (PK)  
\- user\_id (FK)  
\- student\_id (FK, nullable)  
\- academic\_period\_id (FK, nullable)  
\- file\_name  
\- storage\_key  
\- file\_type  
\- file\_category (evidence | material | planning)  
\- note (nullable)  
\- created\_at  
\- updated\_at

Reglas:  
\- Evidencias: student\_id NOT NULL  
\- Exportación por alumno y periodo

\---

\#\#\# 4.15 \`student\_share\_consents\`  
Consentimiento de compartición.

Campos:  
\- id (PK)  
\- student\_id (FK)  
\- from\_user\_id (FK)  
\- to\_user\_id (FK)  
\- is\_active  
\- created\_at  
\- expires\_at (nullable)  
\- revoked\_at (nullable)

\---

\#\#\# 4.16 \`student\_share\_consent\_types\`  
Tipos compartidos.

Campos:  
\- id (PK)  
\- consent\_id (FK)  
\- record\_type (conducta | tutoría | médico | cognitivo)

Regla:  
\- Nunca se comparten calificaciones ni asistencia

\---

\#\# 5\. Procesos automáticos (Backend)

\#\#\# 5.1 Archivado de periodos  
\- Frecuencia: diaria (02:00 AM)  
\- Implementación: NestJS Scheduler  
\- Acción:  
  \- Archivar periodos vencidos  
  \- Archivar grupos asociados  
  \- Bloquear edición

\---

\#\# 6\. Índices obligatorios

\- Todos los FKs  
\- students(full\_name)  
\- attendance(student\_assignment\_id, date)  
\- student\_records(student\_id, context\_id, type, status)  
\- files(user\_id, academic\_period\_id)  
\- student\_assignment\_history(student\_assignment\_id, performed\_at)

\---

\#\# 7\. Validaciones y constraints

\#\#\# Nivel Base de Datos  
\- UNIQUE:  
  \- users(email)  
  \- groups(academic\_period\_id, name)  
  \- grades(evaluation\_item\_id, student\_assignment\_id)  
\- CHECK:  
  \- evaluation\_items.weight BETWEEN 0 AND 100

\#\#\# Nivel Backend (NestJS)  
\- Un solo periodo activo por contexto  
\- No solapamiento de fechas  
\- Un alumno activo por grupo  
\- Control de compartición de historial  
\- Fuzzy matching de alumnos

\---

\#\# 8\. Vistas del sistema

\#\#\# 8.1 \`dashboard\_summary\`  
Vista simple (no materializada).

Propósito:  
\- Home del docente

Incluye:  
\- Contextos activos  
\- Periodos activos y archivados  
\- Grupos activos  
\- Alumnos activos

\---

\#\# 9\. Alcance V1

Incluido:  
\- Uso completo FREE  
\- Sin límites artificiales  
\- Sin monetización

Excluido (V2):  
\- Suscripciones  
\- Import templates configurables  
\- Auditoría avanzada  
\- Vistas materializadas  
\- Triggers complejos

\---

\#\# ✅ ESTADO FINAL  
\*\*VERSIÓN 1.3 – CONGELADA DEFINITIVA PARA DESARROLLO\*\*