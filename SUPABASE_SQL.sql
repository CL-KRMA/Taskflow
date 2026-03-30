-- ============================================================
-- CONFIGURATIONS SUPABASE SQL POUR TASKFLOW
-- ============================================================
-- Exécutez ces commandes dans la console SQL de Supabase
-- https://app.supabase.com/

-- ============================================================
-- TABLE: USER_PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Politique : SELECT - Les utilisateurs voient leur propre profil
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Politique : INSERT - Les utilisateurs peuvent créer leur profil
DROP POLICY IF EXISTS "Users can create their profile" ON user_profiles;
CREATE POLICY "Users can create their profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);  -- Permet l'insertion (triggerée par auth)

-- Politique : INSERT - Système peut créer les profils
DROP POLICY IF EXISTS "System can create profiles" ON user_profiles;
CREATE POLICY "System can create profiles"
  ON user_profiles
  FOR INSERT
  USING (true)
  WITH CHECK (true);

-- Politique : UPDATE - Les utilisateurs peuvent modifier leur profil
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS user_profiles_updated_at ON user_profiles;
CREATE TRIGGER user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- TABLE: PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT name_not_empty CHECK (length(name) > 0)
);

-- Activer RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Politique : SELECT - Les utilisateurs voient uniquement leurs projets
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
CREATE POLICY "Users can view their own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : INSERT - Les utilisateurs peuvent créer leurs propres projets
DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : UPDATE - Les utilisateurs peuvent modifier leurs propres projets
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique : DELETE - Les utilisateurs peuvent supprimer leurs propres projets
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ============================================================
-- TABLE: TASKS (exemple pour gérer les tâches des projets)
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'done'
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high'
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT title_not_empty CHECK (length(title) > 0)
);

-- Activer RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Politique : SELECT - Les utilisateurs voient les tâches de leurs projets
DROP POLICY IF EXISTS "Users can view their project tasks" ON tasks;
CREATE POLICY "Users can view their project tasks"
  ON tasks
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Politique : INSERT - Les utilisateurs peuvent créer des tâches dans leurs projets
DROP POLICY IF EXISTS "Users can create tasks in their projects" ON tasks;
CREATE POLICY "Users can create tasks in their projects"
  ON tasks
  FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Politique : UPDATE - Les utilisateurs peuvent modifier les tâches de leurs projets
DROP POLICY IF EXISTS "Users can update project tasks" ON tasks;
CREATE POLICY "Users can update project tasks"
  ON tasks
  FOR UPDATE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Politique : DELETE - Les utilisateurs peuvent supprimer les tâches de leurs projets
DROP POLICY IF EXISTS "Users can delete project tasks" ON tasks;
CREATE POLICY "Users can delete project tasks"
  ON tasks
  FOR DELETE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- ============================================================
-- TABLE: STORAGE VOLUMES (pour gérer les fichiers)
-- Note: Les buckets de storage doivent être créés via interface
-- ============================================================

-- ============================================================
-- FONCTIONS UTILES
-- ============================================================

-- Fonction pour mettre à jour le champ updated_at automatiquement
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer automatiquement le profil utilisateur à l'inscription
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, '', '')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer le profil automatiquement lors de l'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_profile();

-- Trigger sur la table projects
DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger sur la table tasks
DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- VÉRIFICATIONS ET GRANTS
-- ============================================================

-- Ajouter les permissions d'authentification
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT DELETE ON TABLES TO authenticated;
