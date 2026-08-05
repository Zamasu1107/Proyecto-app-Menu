import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',             // El usuario por defecto que te da DBngin
    password: '',    // RETO 2: ¿Qué contraseña le configuraste en DBngin? (Si la dejaste en blanco, pon comillas vacías '')
    database: 'bar_db',  // La base de datos que creamos en Beekeeper
    port: 3306,               // El puerto estándar de MySQL
    waitForConnections: true,
    connectionLimit: 10,      // Máximo 10 conexiones simultáneas flotando
    queueLimit: 0
});

export default pool;