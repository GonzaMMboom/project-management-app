// ============================================================================
// CONTROLLERS: PROJECT CONTROLLER
// ============================================================================
// Los controladores se encargan de:
// - Recibir las peticiones HTTP (req, res)
// - Extraer datos del request (body, params, query)
// - Llamar a los servicios para procesar la lógica
// - Enviar respuestas HTTP al cliente
//
// IMPORTANTE: Los controladores NO contienen lógica de negocio,
// solo coordinan entre HTTP y los servicios.
// ============================================================================

// 1. IMPORTAR DEPENDENCIAS
// -------------------------
// Importamos el servicio de proyectos que contiene toda la lógica de negocio
const projectService = require("../services/projectService");

// ============================================================================
// 2. DEFINIR LOS CONTROLADORES
// ============================================================================

// ========================================================================
// CREAR PROYECTO
// ========================================================================
// Ruta: POST /api/projects
// Descripción: Crea un nuevo proyecto
//
// Request Body:
//   {
//     "name": "Nombre del proyecto",
//     "description": "Descripción del proyecto" (opcional)
//   }
//
// Response 201:
//   {
//     "message": "Proyecto creado correctamente",
//     "project": { id, name, description }
//   }
//
// Nota: El userId se obtendrá del token JWT cuando se implemente
//       el middleware de autenticación. Por ahora se puede pasar en el body.
// ========================================================================
const create = async (req, res) => {
  try {
    // Extraer datos del body de la petición
    const { name, description } = req.body;
    
    // Obtener userId del token JWT (viene del middleware de autenticación)
    // El middleware guarda el userId en req.user.userId
    const userId = req.user?.userId;

    // Validar que el userId esté presente
    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado"
      });
    }

    // Llamar al servicio para crear el proyecto
    // El servicio se encarga de todas las validaciones y la lógica de negocio
    const project = await projectService.create({
      name,
      description,
      userId
    });

    // Si todo sale bien, responder con éxito
    res.status(201).json({
      message: "Proyecto creado correctamente",
      project
    });
  } catch (error) {
    // Si hay un error, responder con el mensaje de error
    res.status(400).json({
      error: error.message
    });
  }
};

// ========================================================================
// OBTENER PROYECTO POR ID
// ========================================================================
// Ruta: GET /api/projects/:id
// Descripción: Obtiene un proyecto específico por su ID
//
// URL Params:
//   - id: ID del proyecto
//
// Response 200:
//   {
//     "project": { id, name, description, created_at }
//   }
// ========================================================================
const getById = async (req, res) => {
  try {
    // Extraer el ID del proyecto de los parámetros de la URL
    const projectId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({
        error: "ID de proyecto inválido"
      });
    }

    // Llamar al servicio para obtener el proyecto
    const project = await projectService.getById(projectId);

    // Responder con el proyecto encontrado
    res.status(200).json({
      project
    });
  } catch (error) {
    // Si el proyecto no existe, el servicio lanzará un error
    // Responder con el código de estado apropiado
    const statusCode = error.message === "Proyecto no encontrado" ? 404 : 400;
    res.status(statusCode).json({
      error: error.message
    });
  }
};

// ========================================================================
// OBTENER PROYECTOS DEL USUARIO AUTENTICADO
// ========================================================================
// Ruta: GET /api/projects
// Descripción: Obtiene todos los proyectos en los que participa el usuario autenticado
//
// Headers:
//   - Authorization: Bearer <token>
//
// Response 200:
//   {
//     "projects": [{ id, name, description, created_at }, ...]
//   }
//
// Nota: Esta ruta requiere autenticación. El userId se obtiene del token JWT
//       a través del middleware de autenticación (req.user.userId)
// ========================================================================
const getAll = async (req, res) => {
  try {
    // Obtener el userId del token JWT (viene del middleware de autenticación)
    // El middleware guarda el userId en req.user.userId
    const userId = req.user?.userId;

    // Validar que el usuario esté autenticado
    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado"
      });
    }

    // Llamar al servicio para obtener los proyectos del usuario autenticado
    // El servicio hace un JOIN entre projects y project_users para obtener
    // solo los proyectos en los que el usuario participa
    const projects = await projectService.getByUserId(userId);

    // Responder con la lista de proyectos del usuario
    res.status(200).json({
      projects
    });
  } catch (error) {
    // Si hay un error, responder con el mensaje
    res.status(400).json({
      error: error.message
    });
  }
};

// ========================================================================
// OBTENER PROYECTOS DE UN USUARIO
// ========================================================================
// Ruta: GET /api/projects/user/:userId
// Descripción: Obtiene todos los proyectos en los que participa un usuario
//
// URL Params:
//   - userId: ID del usuario
//
// Response 200:
//   {
//     "projects": [{ id, name, description, created_at }, ...]
//   }
//
// Nota: En el futuro, esto podría ser GET /api/projects/my-projects
//       y obtener el userId del token JWT automáticamente
// ========================================================================
const getByUserId = async (req, res) => {
  try {
    // Extraer el userId de los parámetros de la URL
    const userId = parseInt(req.params.userId);

    // Validar que el userId sea un número válido
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        error: "ID de usuario inválido"
      });
    }

    // Llamar al servicio para obtener los proyectos del usuario
    const projects = await projectService.getByUserId(userId);

    // Responder con la lista de proyectos
    res.status(200).json({
      projects
    });
  } catch (error) {
    // Si hay un error, responder con el mensaje
    res.status(400).json({
      error: error.message
    });
  }
};

// ========================================================================
// ACTUALIZAR PROYECTO
// ========================================================================
// Ruta: PUT /api/projects/:id
// Descripción: Actualiza los datos de un proyecto
//
// URL Params:
//   - id: ID del proyecto a actualizar
//
// Request Body:
//   {
//     "name": "Nuevo nombre" (opcional),
//     "description": "Nueva descripción" (opcional)
//   }
//
// Response 200:
//   {
//     "message": "Proyecto actualizado correctamente",
//     "project": { id, name, description, created_at }
//   }
// ========================================================================
const update = async (req, res) => {
  try {
    // Extraer el ID del proyecto de los parámetros de la URL
    const projectId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({
        error: "ID de proyecto inválido"
      });
    }

    // Extraer los datos a actualizar del body
    const { name, description } = req.body;

    // Obtener userId del token JWT (viene del middleware de autenticación)
    const userId = req.user?.userId;

    // Validar que el userId esté presente
    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado"
      });
    }

    // Llamar al servicio para actualizar el proyecto
    // El servicio valida permisos y actualiza solo los campos proporcionados
    const project = await projectService.update(projectId, userId, {
      name,
      description
    });

    // Responder con el proyecto actualizado
    res.status(200).json({
      message: "Proyecto actualizado correctamente",
      project
    });
  } catch (error) {
    // Determinar el código de estado según el tipo de error
    let statusCode = 400;
    if (error.message === "Proyecto no encontrado") {
      statusCode = 404;
    } else if (error.message.includes("permisos")) {
      statusCode = 403;
    }

    res.status(statusCode).json({
      error: error.message
    });
  }
};

// ========================================================================
// ELIMINAR PROYECTO
// ========================================================================
// Ruta: DELETE /api/projects/:id
// Descripción: Elimina un proyecto del sistema
//
// URL Params:
//   - id: ID del proyecto a eliminar
//
// Response 200:
//   {
//     "message": "Proyecto eliminado correctamente"
//   }
// ========================================================================
const deleteProject = async (req, res) => {
  try {
    // Extraer el ID del proyecto de los parámetros de la URL
    const projectId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({
        error: "ID de proyecto inválido"
      });
    }

    // Obtener userId del token JWT (viene del middleware de autenticación)
    const userId = req.user?.userId;

    // Validar que el userId esté presente
    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado"
      });
    }

    // Llamar al servicio para eliminar el proyecto
    // El servicio valida permisos antes de eliminar
    await projectService.delete(projectId, userId);

    // Responder con éxito
    res.status(200).json({
      message: "Proyecto eliminado correctamente"
    });
  } catch (error) {
    // Determinar el código de estado según el tipo de error
    let statusCode = 400;
    if (error.message === "Proyecto no encontrado") {
      statusCode = 404;
    } else if (error.message.includes("permisos")) {
      statusCode = 403;
    }

    res.status(statusCode).json({
      error: error.message
    });
  }
};

// ========================================================================
// AGREGAR USUARIO A PROYECTO
// ========================================================================
// Ruta: POST /api/projects/:id/users
// Descripción: Agrega un usuario como miembro de un proyecto
//
// URL Params:
//   - id: ID del proyecto
//
// Request Body:
//   {
//     "userId": 2  // ID del usuario a agregar
//   }
//
// Response 200:
//   {
//     "message": "Usuario agregado al proyecto correctamente"
//   }
// ========================================================================
const addUser = async (req, res) => {
  try {
    // Extraer el ID del proyecto de los parámetros de la URL
    const projectId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({
        error: "ID de proyecto inválido"
      });
    }

    // Extraer el userId del usuario a agregar del body
    const userId = parseInt(req.body.userId);

    // Validar que el userId sea un número válido
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        error: "ID de usuario inválido"
      });
    }

    // Obtener requesterId del token JWT (viene del middleware de autenticación)
    const requesterId = req.user?.userId;

    // Validar que el requesterId esté presente
    if (!requesterId) {
      return res.status(401).json({
        error: "Usuario no autenticado"
      });
    }

    // Llamar al servicio para agregar el usuario al proyecto
    // El servicio valida permisos antes de agregar
    await projectService.addUser(projectId, userId, requesterId);

    // Responder con éxito
    res.status(200).json({
      message: "Usuario agregado al proyecto correctamente"
    });
  } catch (error) {
    // Determinar el código de estado según el tipo de error
    let statusCode = 400;
    if (error.message === "Proyecto no encontrado") {
      statusCode = 404;
    } else if (error.message.includes("permisos")) {
      statusCode = 403;
    }

    res.status(statusCode).json({
      error: error.message
    });
  }
};

// ========================================================================
// REMOVER USUARIO DE PROYECTO
// ========================================================================
// Ruta: DELETE /api/projects/:id/users/:userId
// Descripción: Remueve un usuario de un proyecto
//
// URL Params:
//   - id: ID del proyecto
//   - userId: ID del usuario a remover
//
// Response 200:
//   {
//     "message": "Usuario removido del proyecto correctamente"
//   }
// ========================================================================
const removeUser = async (req, res) => {
  try {
    // Extraer el ID del proyecto de los parámetros de la URL
    const projectId = parseInt(req.params.id);

    // Extraer el userId del usuario a remover de los parámetros de la URL
    const userId = parseInt(req.params.userId);

    // Validar que ambos IDs sean números válidos
    if (!projectId || isNaN(projectId) || !userId || isNaN(userId)) {
      return res.status(400).json({
        error: "IDs inválidos"
      });
    }

    // Obtener requesterId del token JWT (viene del middleware de autenticación)
    const requesterId = req.user?.userId;

    // Validar que el requesterId esté presente
    if (!requesterId) {
      return res.status(401).json({
        error: "Usuario no autenticado"
      });
    }

    // Llamar al servicio para remover el usuario del proyecto
    // El servicio valida permisos antes de remover
    await projectService.removeUser(projectId, userId, requesterId);

    // Responder con éxito
    res.status(200).json({
      message: "Usuario removido del proyecto correctamente"
    });
  } catch (error) {
    // Determinar el código de estado según el tipo de error
    let statusCode = 400;
    if (error.message === "Proyecto no encontrado") {
      statusCode = 404;
    } else if (error.message.includes("permisos")) {
      statusCode = 403;
    }

    res.status(statusCode).json({
      error: error.message
    });
  }
};

// ========================================================================
// OBTENER USUARIOS DE UN PROYECTO
// ========================================================================
// Ruta: GET /api/projects/:id/users
// Descripción: Obtiene la lista de todos los usuarios que pertenecen a un proyecto
//
// URL Params:
//   - id: ID del proyecto
//
// Response 200:
//   {
//     "users": [{ id, email, role }, ...]
//   }
// ========================================================================
const getProjectUsers = async (req, res) => {
  try {
    // Extraer el ID del proyecto de los parámetros de la URL
    const projectId = parseInt(req.params.id);

    // Validar que el ID sea un número válido
    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({
        error: "ID de proyecto inválido"
      });
    }

    // Llamar al servicio para obtener los usuarios del proyecto
    const users = await projectService.getProjectUsers(projectId);

    // Responder con la lista de usuarios
    res.status(200).json({
      users
    });
  } catch (error) {
    // Determinar el código de estado según el tipo de error
    let statusCode = 400;
    if (error.message === "Proyecto no encontrado") {
      statusCode = 404;
    }

    res.status(statusCode).json({
      error: error.message
    });
  }
};

// ============================================================================
// 3. EXPORTAR LOS CONTROLADORES
// ============================================================================
// Exportamos todos los controladores para que puedan ser usados en las rutas
module.exports = {
  create,
  getById,
  getAll,
  getByUserId,
  update,
  delete: deleteProject,  // Usamos 'delete' como nombre de exportación pero 'deleteProject' como nombre de función
  addUser,
  removeUser,
  getProjectUsers
};

// ============================================================================
// NOTAS IMPORTANTES
// ============================================================================
//
// 1. AUTENTICACIÓN:
//    - Actualmente el userId se obtiene de req.body o req.params
//    - Cuando se implemente el middleware de autenticación JWT, el userId
//      vendrá automáticamente de req.user.id
//
// 2. CÓDIGOS DE ESTADO HTTP:
//    - 200: Éxito (GET, PUT, DELETE exitosos)
//    - 201: Creado (POST exitoso)
//    - 400: Error del cliente (validaciones, datos inválidos)
//    - 401: No autenticado (falta token o token inválido)
//    - 403: Sin permisos (usuario no tiene acceso)
//    - 404: No encontrado (recurso no existe)
//
// 3. VALIDACIONES:
//    - Los controladores validan formato básico (IDs numéricos, campos requeridos)
//    - La lógica de negocio y validaciones complejas están en el servicio
//
// ============================================================================

