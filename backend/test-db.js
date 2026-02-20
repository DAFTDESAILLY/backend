const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

async function testConnection() {
    const host = '127.0.0.1'; // Force IPv4
    const user = process.env.DB_USERNAME || 'school_user';
    const password = process.env.DB_PASSWORD || 'school_password';

    console.log('--- CONNECTION TEST 2 ---');
    console.log(`Target: ${host}:${process.env.DB_PORT || 3306}`);
    console.log(`User: ${user}`);
    console.log(`Password: ${password.substring(0, 2)}...${password.slice(-2)} (len: ${password.length})`);

    try {
        const connection = await mysql.createConnection({
            host: host,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: user,
            password: password,
            database: process.env.DB_DATABASE || 'school_db',
        });
        console.log('SUCCESS: Connected!');
        await connection.end();
    } catch (error) {
        console.error('FAILURE:', error.message);
        console.error('Code:', error.code);
    }
}

testConnection();
