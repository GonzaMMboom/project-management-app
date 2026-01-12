CREATE TABLE project_users (
  project_id INT NOT NULL,
  user_id INT NOT NULL,

  PRIMARY KEY (project_id, user_id),

  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
