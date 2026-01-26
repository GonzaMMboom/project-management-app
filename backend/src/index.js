const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');


require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes"); //Aca estamos importando el router de authRoutes
const projectRoutes = require("./routes/projectRoutes"); //Aca estamos importando el router de projectRoutes



app.use("/api/auth", authRoutes); //Aca estamos usando el router de authRoutes para que las rutas de autenticación estén en la ruta /api/auth
app.use("/api/projects", projectRoutes); //Aca estamos usando el router de projectRoutes para que las rutas de proyectos estén en la ruta /api/projects

app.listen(3000, () => {
  console.log("Servidor corriendo");
});