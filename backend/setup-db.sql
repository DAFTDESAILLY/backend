-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario si no existe (MySQL 8.0 syntax)
CREATE USER IF NOT EXISTS 'school_user'@'localhost' IDENTIFIED BY 'school_password';

-- Otorgar todos los privilegios en la base de datos school_db
GRANT ALL PRIVILEGES ON school_db.* TO 'school_user'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Mostrar usuarios creados
SELECT User, Host FROM mysql.user WHERE User='school_user';
