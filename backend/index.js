const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Entiende los datos en formato JSON

// Rutas
app.use('/api', require('./src/routes/auth'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});