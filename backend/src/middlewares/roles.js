// middlewares/roles.js es un middleware de autorización que se encarga de verificar si el usuario tiene los permisos necesarios para acceder a un recurso

const roles = (allowedRoles = []) => {
    return (req, res, next) => {
      // req.user viene del middleware auth
      if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
      }
  
      const { role } = req.user;
  
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          error: "No tenés permisos para acceder a este recurso"
        });
      }
  
      next();
    };
  };
  
  module.exports = roles;
  