const db = require("../config/db");

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];     //devuelve el primer usuario encontrado
  }
};

module.exports = User;  //exporta el modelo para que se pueda usar en otros archivos


//--------------------------------Para poder usar el modelo en otro archivo--------------------------------

//const User = require("../models/User");

//const user = await User.findByEmail(email);

//--------------------------------Fin de la sección de uso del modelo--------------------------------