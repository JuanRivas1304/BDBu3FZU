const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: '66.179.210.84',  // Cambia a tu host de MySQL
  user: 'connectacrm',
  password: 'p1osn016',
  database: 'connectaCRM'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Ruta para autenticación
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Consulta el usuario en la base de datos
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = results[0];

    // Compara la contraseña proporcionada con la contraseña en la base de datos
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      // Autenticación exitosa
      res.status(200).json({ message: 'Autenticación exitosa', user: { email: user.email } });
    });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
