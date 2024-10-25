const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../db');
const router = express.Router();

// Clave secreta para JWT
const JWT_SECRET = 'mi_clave_secreta';

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.status(201).json({ message: 'Usuario registrado con éxito' });
        }
    );
});

// Login de usuario
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) return res.status(500).json({ error: 'Error en la base de datos' });

            if (results.length === 0) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        }
    );
});

module.exports = router;
