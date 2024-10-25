const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.MARIADB_HOST || 'localhost',
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || '123',
    database: process.env.MARIADB_DATABASE || 'api_proyecto',
    connectionLimit: 15, 
    acquireTimeout: 60000, 
    connectTimeout: 30000,
    idleTimeout: 30000,
});

module.exports = pool;
