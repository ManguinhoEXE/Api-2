const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Encripta la contraseña

        connection.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err, results) => {
                if (err) {
                    console.error('Error al registrar usuario:', err);
                    return res.status(500).json({ error: 'Error al registrar usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado con éxito' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

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

            const token = jwt.sign({ id: user.id }, 'mi_clave_secreta', { expiresIn: '1h' });
            res.json({ token });
        }
    );
});

