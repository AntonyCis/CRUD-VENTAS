const pool = require('../config/db');

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validacion basica 
    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, envía email y password' });
    }

    try {
        // 1. Buscar al usuario en la base de datos
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        // Si no existe el email
        if (usuarios.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = usuarios[0];

        // 2. Comparar contraseña (MVP simple)
        if (usuario.password !== password) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Respuesta exitosa (Devolvemos los datos clave, sin el password)
        res.json({
            mensaje: 'Login exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { login }