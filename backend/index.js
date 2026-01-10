const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
      console.log("Error de conexión:", err);
    } else {
      console.log("Conectado a MySQL ✔");
    }
  });

  
  //aca falta la conexión a la base de datos



app.listen(3001, () => {
    console.log("Servidor backend corriendo en http://localhost:3001");
  });