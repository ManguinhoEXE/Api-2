const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '123', 
    database: 'api_proyecto',
    supportBigNumbers: true,  
    bigNumberStrings: true,   
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Error al conectar con MySQL:', err);
        return;
    }
    console.log('✅ Conexión a MySQL exitosa');
});

module.exports = connection;
