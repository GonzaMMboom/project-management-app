//Services: aca se encargan de definir las funciones que se encargan de la lógica de la aplicación.


//Registro

// verificar si el usuario existe
// hashear la contraseña
// guardar el usuario

//Login

// buscar usuario por email
// comparar password
// generar JWT


//1- Primero vamos a importar los requerimientos

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//2- Luego vamos a crear el servicio de autenticación //authService es un objeto que contiene las funciones de registro y login
const authService = {
    register: async ({ email, password } = {}) => {
      if (!email || !password) {
        throw new Error("Email y contraseña son requeridos");
      }
      const existingUser = await User.findByEmail(email);       //Aca estamos usando el modelo User para buscar el usuario por email
      if (existingUser) {
        throw new Error("El usuario ya existe");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });
      return {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      };
    },
  
    login: async ({ email, password } = {}) => {
      if (!email || !password) {
        throw new Error("Email y contraseña son requeridos");
      }
      const user = await User.findByEmail(email);
      if(!user) {
        throw new Error("Usuario no encontrado");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);  //payload, es la información que se va a guardar en el token
        return {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
        };
    },
  };
  
  module.exports = authService;