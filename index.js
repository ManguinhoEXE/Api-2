const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/auth');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config();


// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);

// WebSocket: Manejo de conexiones
io.on('connection', (socket) => {
    console.log('🔌 Nuevo cliente conectado');

    socket.on('mensaje', (msg) => {
        console.log('Mensaje recibido:', msg);
        io.emit('mensaje', msg);
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
