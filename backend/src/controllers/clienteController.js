const pool = require('../config/db');

// Metodo GET: Lista de clientes
const getClientes = async (req, res) => {
    try {
        const [clientes] = await pool.query('SELECT * FROM clientes ORDER BY created_at DESC');
        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Metodo POST: Crear nuevo cliente
const createCliente = async (req, res) => {
    const { nombre, cedula, telefono, email } = req.body;

    if (!nombre || !cedula) {
        return res.status(400).json({ error: 'El nombre y la cédula son obligatorios' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, cedula, telefono, email) VALUES (?, ?, ?, ?)',
            [nombre, cedula, telefono, email]
        );
        res.status(201).json({ 
            mensaje: 'Cliente creado con éxito', 
            id_cliente: result.insertId 
        });
    } catch (error) {
        // Manejo de error si la cédula o el email ya existen (por los UNIQUE de tu BD)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'La cédula o el email ya están registrados' });
        }
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Metodo PUT: Actualizar cliente
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, cedula, telefono, email } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE clientes SET nombre = ?, cedula = ?, telefono = ?, email = ? WHERE id_cliente = ?',
            [nombre, cedula, telefono, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json({ mensaje: 'Cliente actualizado correctamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'La cédula o el email ya están en uso por otro cliente' });
        }
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Metodo DELETE: Eliminar cliente
const deleteCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente
};