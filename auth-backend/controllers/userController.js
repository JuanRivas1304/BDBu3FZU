const db = require('../models/db'); // Importa la conexión a la base de datos

// Obtener información de un usuario por ID
const getUserById = async (req, res) => {
    const userId = req.user.userId; // Asumiendo que el ID del usuario se establece en el token

    try {
        const [results] = await db.query('SELECT email FROM usuarios WHERE id = ?', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ user: results[0] });
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getUserData = async (req, res) => {
    const { userId } = req.body; // Obtener el email del cuerpo de la solicitud

    if (!userId) {
        return res.status(400).json({ message: 'El correo electrónico es obligatorio' });
    }

    try {
        const [results] = await db.query(
            'SELECT nombre, apellido, email FROM usuarios WHERE email = ?', // Asegúrate de que se incluya el campo 'telefono' en la consulta
            [userId] // Usar el correo electrónico como parámetro de búsqueda
        );

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ user: results[0] });
    } catch (err) {
        console.error('Error en el servidor: ', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


module.exports = {
    getUserById,
    getUserData,
};
