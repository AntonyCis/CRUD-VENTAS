// backend/routes/citas.js
const express = require('express');
const router = express.Router();
const { getCitas, createCita, updateCita, deleteCita } = require('../controllers/citaController');

router.get('/', getCitas);
router.post('/', createCita);
router.put('/:id', updateCita);
router.delete('/:id', deleteCita);

module.exports = router;