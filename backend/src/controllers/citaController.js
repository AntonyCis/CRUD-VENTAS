// backend/controllers/citaController.js
const pool = require('../config/db');

// 🟢 GET: Listar todas las citas (Con JOIN para traer el nombre del cliente)
const getCitas = async (req, res) => {
    try {
        const query = `
            SELECT c.id_cita, c.fecha, c.hora, c.descripcion, c.estado, 
                   cl.id_cliente, cl.nombre AS nombre_cliente
            FROM citas c
            JOIN clientes cl ON c.id_cliente = cl.id_cliente
            ORDER BY c.fecha ASC, c.hora ASC
        `;
        const [citas] = await pool.query(query);
        res.json(citas);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🔵 POST: Crear una nueva cita
const createCita = async (req, res) => {
    const { id_cliente, fecha, hora, descripcion } = req.body;

    if (!id_cliente || !fecha || !hora) {
        return res.status(400).json({ error: 'El cliente, la fecha y la hora son obligatorios' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO citas (id_cliente, fecha, hora, descripcion) VALUES (?, ?, ?, ?)',
            [id_cliente, fecha, hora, descripcion]
        );
        res.status(201).json({ 
            mensaje: 'Cita agendada con éxito', 
            id_cita: result.insertId 
        });
    } catch (error) {
        // Error común: enviar un id_cliente que no existe en la BD
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'El cliente seleccionado no existe' });
        }
        console.error('Error al crear cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🟠 PUT: Editar una cita (ideal para cambiar el estado a 'completada' o 'cancelada')
const updateCita = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora, descripcion, estado } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE citas SET fecha = ?, hora = ?, descripcion = ?, estado = ? WHERE id_cita = ?',
            [fecha, hora, descripcion, estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json({ mensaje: 'Cita actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 🔴 DELETE: Eliminar una cita
const deleteCita = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM citas WHERE id_cita = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        res.json({ mensaje: 'Cita eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getCitas, createCita, updateCita, deleteCita };