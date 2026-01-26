// ============================================================================
// SERVICES: PROJECT SERVICE
// ============================================================================
// Este servicio contiene la lógica de negocio para la gestión de proyectos.
// Los servicios se encargan de:
// - Validar los datos antes de guardarlos
// - Aplicar reglas de negocio
// - Coordinar operaciones entre modelos
// - Manejar errores y excepciones
//
// IMPORTANTE: Los servicios NO se comunican directamente con HTTP (req/res),
// eso lo hacen los controladores. Los servicios solo procesan datos.
// ============================================================================

// 1. IMPORTAR DEPENDENCIAS
// -------------------------
// Importamos el modelo Project para interactuar con la base de datos
const Project = require("../models/Project");

// ============================================================================
// 2. DEFINIR EL SERVICIO
// ============================================================================
// projectService es un objeto que contiene todas las funciones de lógica
// de negocio relacionadas con proyectos
const projectService = {
  
  // ========================================================================
  // CREAR PROYECTO
  // ========================================================================
  // Descripción: Crea un nuevo proyecto y asigna al usuario creador como miembro
  // 
  // Parámetros:
  //   - name: Nombre del proyecto (requerido)
  //   - description: Descripción del proyecto (opcional)
  //   - userId: ID del usuario que crea el proyecto (requerido)
  //
  // Retorna: Objeto con los datos del proyecto creado
  //
  // Validaciones:
  //   - El nombre es obligatorio
  //   - El userId es obligatorio
  //   - El nombre no puede estar vacío
  // ========================================================================
  create: async ({ name, description, userId } = {}) => {
    // Validar que el nombre esté presente
    if (!name || name.trim() === "") {
      throw new Error("El nombre del proyecto es requerido");
    }

    // Validar que el userId esté presente
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }

    // Crear el proyecto usando el modelo
    // El modelo Project.create() crea el proyecto y automáticamente
    // agrega al usuario como miembro si se proporciona userId
    const newProject = await Project.create({
      name: name.trim(),
      description: description ? description.trim() : null,
      userId: userId
    });

    // Retornar el proyecto creado
    return {
      id: newProject.id,
      name: newProject.name,
      description: newProject.description
    };
  },

  // ========================================================================
  // OBTENER PROYECTO POR ID
  // ========================================================================
  // Descripción: Busca un proyecto específico por su ID
  //
  // Parámetros:
  //   - projectId: ID del proyecto a buscar
  //
  // Retorna: Objeto con los datos del proyecto o null si no existe
  //
  // Validaciones:
  //   - El projectId debe ser válido
  //   - El proyecto debe existir
  // ========================================================================
  getById: async (projectId) => {
    // Validar que el ID esté presente
    if (!projectId) {
      throw new Error("El ID del proyecto es requerido");
    }

    // Buscar el proyecto en la base de datos
    const project = await Project.findById(projectId);

    // Si no existe, lanzar un error
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Retornar el proyecto encontrado
    return project;
  },

  // ========================================================================
  // OBTENER TODOS LOS PROYECTOS
  // ========================================================================
  // Descripción: Obtiene una lista de todos los proyectos en el sistema
  //
  // Retorna: Array con todos los proyectos ordenados por fecha de creación
  //
  // Nota: En producción, podrías querer agregar paginación aquí
  // ========================================================================
  getAll: async () => {
    // Obtener todos los proyectos usando el modelo
    const projects = await Project.findAll();
    
    // Retornar la lista de proyectos
    return projects;
  },

  // ========================================================================
  // OBTENER PROYECTOS DE UN USUARIO
  // ========================================================================
  // Descripción: Obtiene todos los proyectos en los que participa un usuario
  //
  // Parámetros:
  //   - userId: ID del usuario
  //
  // Retorna: Array con los proyectos del usuario
  //
  // Validaciones:
  //   - El userId debe ser válido
  // ========================================================================
  getByUserId: async (userId) => {
    // Validar que el userId esté presente
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }

    // Buscar los proyectos del usuario usando el modelo
    // El modelo hace un JOIN entre projects y project_users
    const projects = await Project.findByUserId(userId);

    // Retornar la lista de proyectos
    return projects;
  },

  // ========================================================================
  // ACTUALIZAR PROYECTO
  // ========================================================================
  // Descripción: Actualiza los datos de un proyecto existente
  //
  // Parámetros:
  //   - projectId: ID del proyecto a actualizar
  //   - userId: ID del usuario que intenta actualizar (para verificar permisos)
  //   - data: Objeto con los nuevos datos (name, description)
  //
  // Retorna: Objeto con el proyecto actualizado
  //
  // Validaciones:
  //   - El proyecto debe existir
  //   - El usuario debe pertenecer al proyecto (o ser admin)
  //   - El nombre no puede estar vacío
  // ========================================================================
  update: async (projectId, userId, { name, description } = {}) => {
    // Validar que el projectId esté presente
    if (!projectId) {
      throw new Error("El ID del proyecto es requerido");
    }

    // Validar que el userId esté presente
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }

    // Verificar que el proyecto existe
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Verificar que el usuario pertenece al proyecto
    // Esto es una validación de seguridad: solo los miembros pueden editar
    const userBelongsToProject = await Project.userBelongsToProject(projectId, userId);
    if (!userBelongsToProject) {
      throw new Error("No tienes permisos para editar este proyecto");
    }

    // Validar que al menos un campo se esté actualizando
    if (!name && !description) {
      throw new Error("Debes proporcionar al menos un campo para actualizar");
    }

    // Si se proporciona nombre, validar que no esté vacío
    if (name !== undefined && name.trim() === "") {
      throw new Error("El nombre del proyecto no puede estar vacío");
    }

    // Preparar los datos para actualizar
    // Solo actualizamos los campos que se proporcionaron
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (description !== undefined) {
      updateData.description = description.trim() || null;
    }

    // Actualizar el proyecto usando el modelo
    const updatedProject = await Project.update(projectId, updateData);

    // Retornar el proyecto actualizado
    return updatedProject;
  },

  // ========================================================================
  // ELIMINAR PROYECTO
  // ========================================================================
  // Descripción: Elimina un proyecto del sistema
  //
  // Parámetros:
  //   - projectId: ID del proyecto a eliminar
  //   - userId: ID del usuario que intenta eliminar (para verificar permisos)
  //
  // Retorna: true si se eliminó correctamente
  //
  // Validaciones:
  //   - El proyecto debe existir
  //   - El usuario debe pertenecer al proyecto (o ser admin)
  //
  // Nota: Al eliminar un proyecto, se eliminan automáticamente:
  //   - Todas las tareas relacionadas (CASCADE)
  //   - Todas las relaciones con usuarios (CASCADE)
  // ========================================================================
  delete: async (projectId, userId) => {
    // Validar que el projectId esté presente
    if (!projectId) {
      throw new Error("El ID del proyecto es requerido");
    }

    // Validar que el userId esté presente
    if (!userId) {
      throw new Error("El ID del usuario es requerido");
    }

    // Verificar que el proyecto existe
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Verificar que el usuario pertenece al proyecto
    // Esto es una validación de seguridad: solo los miembros pueden eliminar
    const userBelongsToProject = await Project.userBelongsToProject(projectId, userId);
    if (!userBelongsToProject) {
      throw new Error("No tienes permisos para eliminar este proyecto");
    }

    // Eliminar el proyecto usando el modelo
    // El CASCADE en la base de datos eliminará automáticamente
    // las tareas y relaciones con usuarios
    const deleted = await Project.delete(projectId);

    if (!deleted) {
      throw new Error("Error al eliminar el proyecto");
    }

    return true;
  },

  // ========================================================================
  // AGREGAR USUARIO A PROYECTO
  // ========================================================================
  // Descripción: Agrega un usuario como miembro de un proyecto
  //
  // Parámetros:
  //   - projectId: ID del proyecto
  //   - userId: ID del usuario a agregar
  //   - requesterId: ID del usuario que hace la solicitud (para verificar permisos)
  //
  // Retorna: true si se agregó correctamente
  //
  // Validaciones:
  //   - El proyecto debe existir
  //   - El usuario que solicita debe pertenecer al proyecto
  //   - El usuario a agregar no debe estar ya en el proyecto
  // ========================================================================
  addUser: async (projectId, userId, requesterId) => {
    // Validar que todos los IDs estén presentes
    if (!projectId || !userId || !requesterId) {
      throw new Error("Todos los IDs son requeridos");
    }

    // Verificar que el proyecto existe
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Verificar que el usuario que solicita pertenece al proyecto
    const requesterBelongsToProject = await Project.userBelongsToProject(projectId, requesterId);
    if (!requesterBelongsToProject) {
      throw new Error("No tienes permisos para agregar usuarios a este proyecto");
    }

    // Verificar que el usuario a agregar no esté ya en el proyecto
    const userAlreadyInProject = await Project.userBelongsToProject(projectId, userId);
    if (userAlreadyInProject) {
      throw new Error("El usuario ya pertenece a este proyecto");
    }

    // Agregar el usuario al proyecto usando el modelo
    const added = await Project.addUser(projectId, userId);

    if (!added) {
      throw new Error("Error al agregar el usuario al proyecto");
    }

    return true;
  },

  // ========================================================================
  // REMOVER USUARIO DE PROYECTO
  // ========================================================================
  // Descripción: Remueve un usuario de un proyecto
  //
  // Parámetros:
  //   - projectId: ID del proyecto
  //   - userId: ID del usuario a remover
  //   - requesterId: ID del usuario que hace la solicitud (para verificar permisos)
  //
  // Retorna: true si se removió correctamente
  //
  // Validaciones:
  //   - El proyecto debe existir
  //   - El usuario que solicita debe pertenecer al proyecto
  //   - El usuario a remover debe estar en el proyecto
  // ========================================================================
  removeUser: async (projectId, userId, requesterId) => {
    // Validar que todos los IDs estén presentes
    if (!projectId || !userId || !requesterId) {
      throw new Error("Todos los IDs son requeridos");
    }

    // Verificar que el proyecto existe
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Verificar que el usuario que solicita pertenece al proyecto
    const requesterBelongsToProject = await Project.userBelongsToProject(projectId, requesterId);
    if (!requesterBelongsToProject) {
      throw new Error("No tienes permisos para remover usuarios de este proyecto");
    }

    // Verificar que el usuario a remover está en el proyecto
    const userInProject = await Project.userBelongsToProject(projectId, userId);
    if (!userInProject) {
      throw new Error("El usuario no pertenece a este proyecto");
    }

    // Remover el usuario del proyecto usando el modelo
    const removed = await Project.removeUser(projectId, userId);

    if (!removed) {
      throw new Error("Error al remover el usuario del proyecto");
    }

    return true;
  },

  // ========================================================================
  // OBTENER USUARIOS DE UN PROYECTO
  // ========================================================================
  // Descripción: Obtiene la lista de todos los usuarios que pertenecen a un proyecto
  //
  // Parámetros:
  //   - projectId: ID del proyecto
  //
  // Retorna: Array con los usuarios del proyecto
  //
  // Validaciones:
  //   - El proyecto debe existir
  // ========================================================================
  getProjectUsers: async (projectId) => {
    // Validar que el projectId esté presente
    if (!projectId) {
      throw new Error("El ID del proyecto es requerido");
    }

    // Verificar que el proyecto existe
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Obtener los usuarios del proyecto usando el modelo
    const users = await Project.getProjectUsers(projectId);

    // Retornar la lista de usuarios
    return users;
  }
};

// ============================================================================
// 3. EXPORTAR EL SERVICIO
// ============================================================================
// Exportamos el servicio para que pueda ser usado en los controladores
module.exports = projectService;

// ============================================================================
// EJEMPLOS DE USO DEL SERVICIO
// ============================================================================
// 
// // Importar el servicio
// const projectService = require("../services/projectService");
//
// // Crear un proyecto
// const project = await projectService.create({
//   name: "Mi Proyecto",
//   description: "Descripción del proyecto",
//   userId: 1
// });
//
// // Obtener proyecto por ID
// const project = await projectService.getById(1);
//
// // Obtener proyectos de un usuario
// const projects = await projectService.getByUserId(1);
//
// // Actualizar proyecto
// const updated = await projectService.update(1, 1, {
//   name: "Nuevo nombre",
//   description: "Nueva descripción"
// });
//
// // Eliminar proyecto
// await projectService.delete(1, 1);
//
// // Agregar usuario a proyecto
// await projectService.addUser(1, 2, 1);
//
// // Remover usuario de proyecto
// await projectService.removeUser(1, 2, 1);
//
// // Obtener usuarios de un proyecto
// const users = await projectService.getProjectUsers(1);
//
// ============================================================================

