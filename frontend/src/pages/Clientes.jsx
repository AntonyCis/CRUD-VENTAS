// frontend/src/pages/Clientes.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({ nombre: '', cedula: '', telefono: '', email: '' });

    // Cargar clientes al montar el componente
    useEffect(() => {
        obtenerClientes();
    }, []);

    const obtenerClientes = async () => {
        try {
            const respuesta = await api.get('/clientes');
            setClientes(respuesta.data);
        } catch (error) {
            console.error('Error al obtener clientes', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/clientes', form);
            obtenerClientes(); // Recargar la tabla
            setForm({ nombre: '', cedula: '', telefono: '', email: '' }); // Limpiar formulario
            alert('Cliente guardado con éxito');
        } catch (error) {
            alert(error.response?.data?.error || 'Error al guardar');
        }
    };

    const eliminarCliente = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await api.delete(`/clientes/${id}`);
                obtenerClientes();
            } catch (error) {
                console.error('Error al eliminar', error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Gestión de Clientes</h2>

            {/* Formulario de Registro */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="form-control" placeholder="Nombre completo" required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="cedula" value={form.cedula} onChange={handleChange} className="form-control" placeholder="Cédula/DNI" required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className="form-control" placeholder="Teléfono" />
                        </div>
                        <div className="col-md-3">
                            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="Correo electrónico" />
                        </div>
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">Registrar Cliente</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tabla de Clientes */}
            <div className="table-responsive shadow-sm">
                <table className="table table-striped table-hover mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Cédula</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length === 0 ? (
                            <tr><td colSpan="5" className="text-center">No hay clientes registrados</td></tr>
                        ) : (
                            clientes.map(cliente => (
                                <tr key={cliente.id_cliente}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.cedula}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.email}</td>
                                    <td>
                                        <button onClick={() => eliminarCliente(cliente.id_cliente)} className="btn btn-sm btn-danger">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clientes;