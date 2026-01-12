const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');


require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Servidor corriendo");
});