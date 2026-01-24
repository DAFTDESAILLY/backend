📚 DOCUMENTACIÓN TÉCNICA V1 (CONGELADA)  
Este documento contiene TODO el diseño técnico del proyecto en formato Markdown. Incluye Base de Datos v1.3 FINAL y Backend v1 FINAL, listos para desarrollo.  
🧭 Índice  
• Estado del documento  
• Base de Datos – v1.3 FINAL  
• Backend – v1 FINAL  
• Decisiones técnicas cerradas  
• Alcance V1 / V2  
1\. ESTADO DEL DOCUMENTO  
✅ CONGELADO DEFINITIVO PARA DESARROLLO  
Este documento no admite cambios estructurales en V1.  
2\. BASE DE DATOS – v1.3 FINAL  
MariaDB \+ TypeORM  
2.1 Principios  
• Nada se elimina físicamente  
• Alumno persistente  
• Separación por contexto  
• Historial solo relevante  
• Privacidad primero  
2.2 Entidades  
users  
• id (PK)  
• email (UNIQUE)  
• password  
• name  
• status  
• created\_at  
• updated\_at  
contexts  
• id (PK)  
• user\_id (FK)  
• name  
• level  
• institution (nullable)  
• status  
• created\_at  
• updated\_at  
academic\_periods  
• id (PK)  
• context\_id (FK)  
• type  
• start\_date  
• end\_date  
• grace\_period\_days  
• status  
• created\_at  
• updated\_at  
Reglas  
• Un solo periodo activo por contexto  
• No solapamiento de fechas  
• Validación en backend  
groups  
• id (PK)  
• academic\_period\_id (FK)  
• name  
• status  
• created\_at  
• updated\_at  
UNIQUE(academic\_period\_id, name)  
subjects  
• id (PK)  
• group\_id (FK)  
• name  
• is\_general (boolean)  
• created\_at  
• updated\_at  
Regla:  
• Se crea automáticamente la materia "General" al crear un grupo  
students  
• id (PK)  
• full\_name  
• birth\_date (nullable)  
• parent\_phone (nullable)  
• notes (nullable)  
• status  
• created\_at  
• updated\_at  
Duplicados prevenidos en UI (fuzzy matching)  
student\_assignments  
• id (PK)  
• student\_id (FK)  
• group\_id (FK)  
• status  
• assigned\_at  
• created\_at  
• updated\_at  
Regla:  
• Alumno activo solo una vez por grupo (validación backend)  
student\_assignment\_history  
• id (PK)  
• student\_assignment\_id (FK)  
• action  
• performed\_by (FK)  
• performed\_at  
attendance  
• id (PK)  
• student\_assignment\_id (FK)  
• subject\_id (FK)  
• date  
• status  
• created\_at  
• updated\_at  
INDEX(student\_assignment\_id, date)  
evaluation\_items  
• id (PK)  
• subject\_id (FK)  
• academic\_period\_id (FK)  
• name  
• weight  
• created\_at  
• updated\_at  
CHECK(weight BETWEEN 0 AND 100\)  
grades  
• id (PK)  
• evaluation\_item\_id (FK)  
• student\_assignment\_id (FK)  
• score  
• created\_at  
• updated\_at  
UNIQUE(evaluation\_item\_id, student\_assignment\_id)  
student\_records  
• id (PK)  
• student\_id (FK)  
• context\_id (FK)  
• academic\_period\_id (nullable)  
• type  
• description  
• status  
• created\_at  
• updated\_at  
student\_record\_replies  
• id (PK)  
• student\_record\_id (FK)  
• reply\_text  
• created\_at  
• updated\_at  
files  
• id (PK)  
• user\_id (FK)  
• student\_id (nullable)  
• academic\_period\_id (nullable)  
• file\_name  
• storage\_key  
• file\_type  
• file\_category  
• note  
• created\_at  
• updated\_at  
student\_share\_consents  
• id (PK)  
• student\_id (FK)  
• from\_user\_id (FK)  
• to\_user\_id (FK)  
• is\_active  
• created\_at  
• expires\_at  
• revoked\_at  
student\_share\_consent\_types  
• id (PK)  
• consent\_id (FK)  
• record\_type  
3\. BACKEND – v1 FINAL  
NestJS \+ TypeORM  
3.1 Stack  
• NestJS  
• TypeORM  
• MariaDB  
• JWT (access \+ refresh)  
• Multer (storage local)  
• @nestjs/schedule  
3.2 Arquitectura  
src/ ├── auth/ ├── users/ ├── academic/ │ ├── contexts/ │ ├── academic-periods/ │ ├── groups/ │ └── subjects/ ├── student-management/ │ ├── students/ │ ├── student-assignments/ │ ├── student-records/ │ └── consents/ ├── assessments/ │ ├── attendance/ │ ├── evaluations/ │ └── grades/ ├── files/ ├── dashboard/ ├── jobs/ ├── common/ └── main.ts   
3.3 Autenticación  
• Access token: 15 min  
• Refresh token: 7 días (en BD)  
Endpoints:  
• POST /auth/register  
• POST /auth/login  
• POST /auth/refresh  
• POST /auth/logout  
• POST /auth/forgot-password  
• POST /auth/reset-password  
3.4 Guards e Interceptors  
Guard Global  
• Usuario activo  
• Periodo NO archivado  
Interceptor  
• Respuesta estándar  
3.5 Módulos y Endpoints (resumen)  
Academic  
• contexts  
• academic-periods  
• groups (crea subject General)  
• subjects  
Student Management  
• students  
• student-assignments  
• student-records  
• consents  
Assessments  
• attendance  
• evaluations  
• grades  
Files  
• upload  
• export  
Dashboard  
• summary  
• recent-activity  
• alerts  
3.6 Jobs  
• Archivado automático (cron diario)  
• Limpieza de refresh tokens (cron semanal)  
4\. DECISIONES TÉCNICAS CERRADAS  
• Arquitectura modular agrupada  
• Backend dicta reglas  
• Storage local preparado para S3  
• Auth con refresh tokens  
• Recuperación de contraseña incluida  
5\. ALCANCE  
V1  
• CRUD completo  
• Auth segura  
• Dashboard básico  
• Archivos locales  
V2  
• Suscripciones  
• S3  
• Auditoría avanzada  
• Notificaciones  
✅ DOCUMENTO FINAL  
TODO EL SISTEMA ESTÁ LISTO PARA CODIFICARSE

* 