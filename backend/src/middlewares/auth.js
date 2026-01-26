// middlewares/auth.js es un middleware de autenticación que se encarga de verificar si el usuario está autenticado y tiene un token válido

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // 1. Obtener el header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // 2. El formato es: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // 3. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Guardar info del usuario en req
    req.user = decoded;

    // 5. Continuar
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = auth;
