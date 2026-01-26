//Modelo de Project: se encarga de manejar las operaciones de base de datos relacionadas con proyectos

const db = require("../config/db");

const Project = {
  // Crear un nuevo proyecto
  create: async ({ name, description, userId }) => {
    const [result] = await db.query(
      "INSERT INTO projects (name, description) VALUES (?, ?)",
      [name, description]
    );
    
    const projectId = result.insertId;
    
    // Si se proporciona un userId, agregar al usuario como miembro del proyecto
    if (userId) {
      await db.query(
        "INSERT INTO project_users (project_id, user_id) VALUES (?, ?)",
        [projectId, userId]
      );
    }
    
    return { id: projectId, name, description };
  },

  // Buscar proyecto por ID
  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Obtener todos los proyectos
  findAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    return rows;
  },

  // Obtener proyectos de un usuario específico
  findByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT p.* FROM projects p
       INNER JOIN project_users pu ON p.id = pu.project_id
       WHERE pu.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return rows;
  },

  // Actualizar un proyecto
  update: async (id, { name, description }) => {
    await db.query(
      "UPDATE projects SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );
    return await Project.findById(id);
  },

  // Eliminar un proyecto
  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM projects WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  // Agregar un usuario a un proyecto
  addUser: async (projectId, userId) => {
    try {
      const [result] = await db.query(
        "INSERT INTO project_users (project_id, user_id) VALUES (?, ?)",
        [projectId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      // Si el usuario ya está en el proyecto, retornar false
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  },

  // Remover un usuario de un proyecto
  removeUser: async (projectId, userId) => {
    const [result] = await db.query(
      "DELETE FROM project_users WHERE project_id = ? AND user_id = ?",
      [projectId, userId]
    );
    return result.affectedRows > 0;
  },

  // Obtener todos los usuarios de un proyecto
  getProjectUsers: async (projectId) => {
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.role 
       FROM users u
       INNER JOIN project_users pu ON u.id = pu.user_id
       WHERE pu.project_id = ?`,
      [projectId]
    );
    return rows;
  },

  // Verificar si un usuario pertenece a un proyecto
  userBelongsToProject: async (projectId, userId) => {
    const [rows] = await db.query(
      "SELECT * FROM project_users WHERE project_id = ? AND user_id = ?",
      [projectId, userId]
    );
    return rows.length > 0;
  }
};

module.exports = Project;

//--------------------------------Para poder usar el modelo en otro archivo--------------------------------

//const Project = require("../models/Project");

// Crear proyecto
//const project = await Project.create({ name: "Mi Proyecto", description: "Descripción", userId: 1 });

// Buscar por ID
//const project = await Project.findById(1);

// Obtener proyectos de un usuario
//const projects = await Project.findByUserId(1);

// Actualizar proyecto
//const updated = await Project.update(1, { name: "Nuevo nombre", description: "Nueva descripción" });

// Agregar usuario al proyecto
//await Project.addUser(1, 2);

// Obtener usuarios del proyecto
//const users = await Project.getProjectUsers(1);

//--------------------------------Fin de la sección de uso del modelo--------------------------------

