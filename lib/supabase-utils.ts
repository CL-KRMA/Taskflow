/**
 * Utilitaires Supabase côté client
 * Fonctions helper pour les opérations courantes avec Supabase
 */

import { supabase } from './supabase';

// ============ PROJETS ============
export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectsWithTaskCounts(userId: string) {
  // Récupérer tous les projets
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (projectsError) throw projectsError;

  // Récupérer les comptages de tâches par projet en 1 seule requête
  const projectIds = projects?.map(p => p.id) || [];
  
  if (projectIds.length === 0) {
    return projects?.map(p => ({
      ...p,
      taskCount: 0,
      completedCount: 0,
    })) || [];
  }

  const { data: taskCounts, error: tasksError } = await supabase
    .from('tasks')
    .select('project_id, status');

  if (tasksError) throw tasksError;

  // Créer une map des comptages
  const countMap: Record<string, { taskCount: number; completedCount: number }> = {};
  
  taskCounts?.forEach(task => {
    if (!countMap[task.project_id]) {
      countMap[task.project_id] = { taskCount: 0, completedCount: 0 };
    }
    countMap[task.project_id].taskCount++;
    if (task.status === 'done') {
      countMap[task.project_id].completedCount++;
    }
  });

  // Ajouter les comptages aux projets
  return projects?.map(project => ({
    ...project,
    taskCount: countMap[project.id]?.taskCount || 0,
    completedCount: countMap[project.id]?.completedCount || 0,
  })) || [];
}

export async function getProjectById(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(
  userId: string,
  name: string,
  description?: string
) {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: userId,
        name,
        description,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateProject(
  projectId: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}

// ============ TÂCHES ============
export async function getTasks(projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTasksByStatus(projectId: string, status: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTask(
  projectId: string,
  userId: string,
  title: string,
  description?: string,
  priority: string = 'medium',
  dueDate?: string
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        project_id: projectId,
        user_id: userId,
        title,
        description,
        priority,
        due_date: dueDate,
        status: 'todo',
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateTask(
  taskId: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}

// ============ AUTHENTIFICATION ============
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
}

export async function getUserSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return session;
}

// ============ REAL-TIME (abonnement aux changements) ============
export function subscribeToProjects(
  userId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`projects:user_id=eq.${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'projects',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}

export function subscribeToTasks(
  projectId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`tasks:project_id=eq.${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `project_id=eq.${projectId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}

// ============ GESTION DES ERREURS ============
export function handleSupabaseError(error: any): string {
  if (error.message) {
    return error.message;
  }

  switch (error.code) {
    case 'PGRST116':
      return 'Ressource non trouvée';
    case '23505':
      return 'Cet élément existe déjà';
    case '42P01':
      return 'Table introuvable';
    default:
      return 'Une erreur est survenue';
  }
}
