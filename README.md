# App ORM School

Sistema de gestión escolar construido con NestJS, TypeORM y MariaDB.

## Tecnologías

- **Backend**: NestJS 10.x
- **ORM**: TypeORM
- **Base de datos**: MariaDB/MySQL
- **Autenticación**: JWT (Access + Refresh Tokens)

## Características

- ✅ Gestión de usuarios y autenticación
- ✅ Contextos académicos multinivel
- ✅ Períodos académicos con validación
- ✅ Gestión de grupos y materias
- ✅ Estudiantes persistentes
- ✅ Asignaciones y seguimiento
- ✅ Asistencia y evaluaciones
- ✅ Registros estudiantiles con réplica
- ✅ Sistema de archivos
- ✅ Consentimientos de compartición

## Instalación

```bash
cd backend
npm install
```

## Configuración

Crear archivo `.env`:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=school_db

JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Base de Datos

Iniciar MariaDB con Docker:
```bash
docker-compose up -d
```

## Documentación

- [Documentación Técnica V1](DOCUMENTACIÓN%20TÉCNICA%20V1%20(CONGELADA).md)
- [Código de Entities](CÓDIGO%20DE%20ENTITIES%20–%20TYPEORM%20(V1).md)
- [Requerimientos de Base de Datos](Documento%20de%20requerimientos%20base%20de%20datos.md)
