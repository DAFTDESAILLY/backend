
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing connection to database...');
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'school_user',
            password: 'school_password',
            database: 'school_db'
        });
        console.log('Successfully connected to the database!');
        await connection.end();
    } catch (error) {
        console.error('Failed to connect:', error);
    }
}

testConnection();
