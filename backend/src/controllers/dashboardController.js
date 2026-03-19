// backend/controllers/dashboardController.js
const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        // Ejecutamos múltiples consultas en paralelo para optimizar el tiempo de respuesta
        const [
            [totalClientes],
            [totalCitas],
            [citasPendientes],
            [citasHoy]
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) AS total FROM clientes'),
            pool.query('SELECT COUNT(*) AS total FROM citas'),
            pool.query('SELECT COUNT(*) AS total FROM citas WHERE estado = "pendiente"'),
            pool.query('SELECT COUNT(*) AS total FROM citas WHERE fecha = CURDATE()')
        ]);

        // Estructuramos la respuesta en un JSON limpio
        res.json({
            total_clientes: totalClientes[0].total,
            total_citas: totalCitas[0].total,
            citas_pendientes: citasPendientes[0].total,
            citas_hoy: citasHoy[0].total
        });

    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getDashboardStats };