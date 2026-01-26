// ============================================================================
// ROUTES: PROJECT ROUTES
// ============================================================================
// Este archivo define todas las rutas relacionadas con proyectos.
// Las rutas se conectan con los controladores que manejan la lógica HTTP.
//
// Estructura:
//   - GET    /api/projects           - Listar proyectos del usuario autenticado
//   - POST   /api/projects           - Crear un nuevo proyecto
//   - GET    /api/projects/:id       - Obtener un proyecto por ID
//   - PUT    /api/projects/:id       - Actualizar un proyecto
//   - DELETE /api/projects/:id       - Eliminar un proyecto
//   - GET    /api/projects/:id/users - Obtener usuarios de un proyecto
//   - POST   /api/projects/:id/users - Agregar usuario a un proyecto
//   - DELETE /api/projects/:id/users/:userId - Remover usuario de un proyecto
// ============================================================================

const express = require("express");
const router = express.Router();

// Importar el controlador de proyectos
const projectController = require("../controllers/projectController");

// Importar el middleware de autenticación
// Este middleware verifica el token JWT y agrega req.user con el userId
const auth = require("../middlewares/auth");

// ============================================================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================================================
// Todas las rutas de proyectos requieren que el usuario esté autenticado.
// El middleware 'auth' se aplica a todas las rutas para verificar el token JWT.

// Aplicar el middleware de autenticación a todas las rutas
router.use(auth);

// GET /api/projects - Listar proyectos del usuario autenticado
// Esta ruta lista solo los proyectos en los que el usuario participa
router.get("/", projectController.getAll);

// POST /api/projects - Crear un nuevo proyecto
// El usuario que crea el proyecto se agrega automáticamente como miembro
router.post("/", projectController.create);

// GET /api/projects/:id - Obtener un proyecto específico por ID
router.get("/:id", projectController.getById);

// PUT /api/projects/:id - Actualizar un proyecto
// Solo los miembros del proyecto pueden actualizarlo
router.put("/:id", projectController.update);

// DELETE /api/projects/:id - Eliminar un proyecto
// Solo los miembros del proyecto pueden eliminarlo
router.delete("/:id", projectController.delete);

// GET /api/projects/:id/users - Obtener todos los usuarios de un proyecto
router.get("/:id/users", projectController.getProjectUsers);

// POST /api/projects/:id/users - Agregar un usuario a un proyecto
// Body: { "userId": 2 }
router.post("/:id/users", projectController.addUser);

// DELETE /api/projects/:id/users/:userId - Remover un usuario de un proyecto
router.delete("/:id/users/:userId", projectController.removeUser);

// ============================================================================
// EXPORTAR EL ROUTER
// ============================================================================
module.exports = router;


