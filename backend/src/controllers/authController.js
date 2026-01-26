//Controllers: son los que se encargan de la lógica de la aplicación, es decir, el control de la aplicación

const authService = require("../services/authService");

const register = async (req, res) => {      //req:contiene lo que manda el cliente, res:contiene lo que manda el servidor
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({
                error: "Email y contraseña son requeridos"
            });
        }
        const user = await authService.register(req.body);      //req.body:contiene lo que manda el cliente, es decir, el email y la contraseña, lo manda el frontend
        //Aca estamos usando el servicio de autenticación para registrar el usuario y devolver el usuario creado
        res.status(201).json({
            message: "Usuario registrado correctamente",
            user
          })  } catch (error) {
            res.status(400).json({
              error: error.message
            });
          }
        };

  const login = async (req, res) => {
    try {
      if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({
          error: "Email y contraseña son requeridos"
        });
      }
      const user = await authService.login(req.body);
      res.status(200).json({
        message: "Usuario logueado correctamente",
        user
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  };




  module.exports = {
    register,
    login
  };