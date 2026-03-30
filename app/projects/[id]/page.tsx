'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { 
  getProjectById, 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  handleSupabaseError 
} from '@/lib/supabase-utils';

interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  project_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export default function TasksPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Charger le projet et les tâches
  useEffect(() => {
    const loadData = async () => {
      if (!user || !projectId) return;
      try {
        setIsLoading(true);
        setError(null);
        
        const projectData = await getProjectById(projectId);
        setProject(projectData);
        
        const tasksData = await getTasks(projectId);
        setTasks(tasksData);
      } catch (err) {
        setError(handleSupabaseError(err));
        console.error('Erreur lors du chargement:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, projectId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user || !projectId) return;

    try {
      const newTask = await createTask(
        projectId,
        user.id,
        newTaskTitle,
        undefined,
        newTaskPriority,
        newTaskDate || undefined
      );
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setNewTaskDate('');
      setShowForm(false);
    } catch (err) {
      setError(handleSupabaseError(err));
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError(handleSupabaseError(err));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(handleSupabaseError(err));
    }
  };

  if (loading || isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Chargement...</div>
      </div>
    );
  }

  if (!user || !project) {
    return null;
  }

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in_progress': tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/projects" className="link" style={{ marginBottom: '1rem', display: 'block' }}>
            ← Retour aux projets
          </Link>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Tâches du projet: <span style={{ color: '#4a90e2' }}>{project?.name}</span>
          </h1>
          <p style={{ color: '#4b5563' }}>{project?.description || 'Pas de description'}</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            border: '1px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        {/* Bouton Ajouter Tâche */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-lg btn-success"
          >
            + Ajouter une tâche
          </button>
        </div>

        {/* Formulaire Ajout Tâche */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-body">
              <h2 className="card-title">Nouvelle Tâche</h2>
              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-control">
                  <label className="label">Titre de la tâche</label>
                  <input
                    type="text"
                    placeholder="Entrez le titre de la tâche"
                    className="input"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-control">
                    <label className="label">Priorité</label>
                    <select
                      className="select"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Date limite</label>
                    <input
                      type="date"
                      className="input"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Ajouter</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline" style={{ flex: 1 }}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Colonnes Kanban */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {(['todo', 'in_progress', 'done'] as const).map((status) => {
            const statusConfig = status === 'todo' ? { title: 'À faire', border: '#6b7280', bg: '#f3f4f6' } :
                                 status === 'in_progress' ? { title: 'En cours', border: '#fbbf24', bg: '#fef3c7' } :
                                 { title: 'Terminé', border: '#10b981', bg: '#dcfce7' };
            return (
              <div key={status} style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: `2px solid ${statusConfig.border}` }}>
                  {statusConfig.title} ({tasksByStatus[status].length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {tasksByStatus[status].map((task) => {
                    const priorityColor = task.priority === 'high' ? { bg: '#fee2e2', text: '#991b1b' } : task.priority === 'medium' ? { bg: '#fef3c7', text: '#92400e' } : { bg: '#dbeafe', text: '#1e40af' };
                    return (
                      <div key={task.id} style={{ backgroundColor: statusConfig.bg, borderRadius: '0.375rem', padding: '1rem', borderLeft: `4px solid ${statusConfig.border}` }}>
                        <h3 style={{ fontWeight: '600', color: status === 'done' ? '#9ca3af' : '#1f2937', textDecoration: status === 'done' ? 'line-through' : 'none' }}>{task.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span className="badge" style={{ backgroundColor: priorityColor.bg, color: priorityColor.text }}>
                            {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </div>
                        {task.due_date && <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Avant: {new Date(task.due_date).toLocaleDateString('fr-FR')}</p>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {task.status === 'todo' && (
                            <button 
                              onClick={() => handleStatusChange(task.id, 'in_progress')} 
                              className="btn btn-sm btn-warning"
                              style={{ flex: 1, minWidth: '100px' }}
                            >
                              ▶ Démarrer
                            </button>
                          )}
                          {task.status === 'in_progress' && (
                            <button 
                              onClick={() => handleStatusChange(task.id, 'done')} 
                              className="btn btn-sm btn-success"
                              style={{ flex: 1, minWidth: '100px' }}
                            >
                              ✓ Terminer
                            </button>
                          )}
                          {task.status === 'done' && (
                            <button 
                              onClick={() => handleStatusChange(task.id, 'todo')} 
                              className="btn btn-sm btn-info"
                              style={{ flex: 1, minWidth: '100px' }}
                            >
                              ↶ Réactiver
                            </button>
                          )}
                          <button onClick={() => handleDeleteTask(task.id)} className="btn btn-sm btn-error">×</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>Aucune tâche pour ce projet</p>
            <button onClick={() => setShowForm(true)} className="btn btn-lg btn-success">Créer votre première tâche</button>
          </div>
        )}
      </div>
    </div>
  );
}
