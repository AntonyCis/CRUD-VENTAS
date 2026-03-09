const express = require('express');
const router = express.Router();
const { getClientes, createCliente, updateCliente, deleteCliente } = require('../controllers/clienteController');

// Definicion de los endpoints siguiendo el estandar REST
router.get('/', getClientes);           // GET /api/clientes
router.post('/', createCliente);        // POST /api/clientes
router.put('/:id', updateCliente);      // PUT /api/clientes/1
router.delete('/:id', deleteCliente);   // DELETE /api/clientes/1

module.exports = router;

