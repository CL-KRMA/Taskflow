'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

const projectNames: Record<string, string> = {
  '1': 'Refonte du site web',
  '2': 'Application mobile',
  '3': 'Migration base de données',
};

export default function TasksPage() {
  const params = useParams();
  const projectId = params.id as string;
  const projectName = projectNames[projectId] || 'Projet inconnu';

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Créer les maquettes',
      status: 'completed',
      priority: 'high',
      dueDate: '2026-04-01',
    },
    {
      id: 2,
      title: 'Développer les composants',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-04-10',
    },
    {
      id: 3,
      title: 'Tests unitaires',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-04-15',
    },
    {
      id: 4,
      title: 'Déployer en production',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-04-20',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDate, setNewTaskDate] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        title: newTaskTitle,
        status: 'todo',
        priority: newTaskPriority,
        dueDate: newTaskDate,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setNewTaskDate('');
      setShowForm(false);
      alert('Tâche ajoutée avec succès!');
    }
  };

  const handleStatusChange = (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed'),
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
            Tâches du projet: <span style={{ color: '#4a90e2' }}>{projectName}</span>
          </h1>
          <p style={{ color: '#4b5563' }}>Gérez les tâches de votre projet</p>
        </div>

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
          {(['todo', 'in-progress', 'completed'] as const).map((status) => {
            const statusConfig = status === 'todo' ? { title: 'À faire', border: '#6b7280', bg: '#f3f4f6' } :
                                 status === 'in-progress' ? { title: 'En cours', border: '#fbbf24', bg: '#fef3c7' } :
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
                        <h3 style={{ fontWeight: '600', color: status === 'completed' ? '#9ca3af' : '#1f2937', textDecoration: status === 'completed' ? 'line-through' : 'none' }}>{task.title}</h3>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <span className="badge" style={{ backgroundColor: priorityColor.bg, color: priorityColor.text }}>{task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}</span>
                        </div>
                        {task.dueDate && <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Avant: {task.dueDate}</p>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', gap: '0.5rem' }}>
                          <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as any)} className="select" style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}>
                            <option value="todo">À faire</option>
                            <option value="in-progress">En cours</option>
                            <option value="completed">Terminé</option>
                          </select>
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
