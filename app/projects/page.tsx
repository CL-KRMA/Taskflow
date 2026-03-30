'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getProjectsWithTaskCounts, createProject, deleteProject, handleSupabaseError } from '@/lib/supabase-utils';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  taskCount?: number;
  completedCount?: number;
}

export default function Projects() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Charger les projets
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        setError(null);
        const projectsData = await getProjectsWithTaskCounts(user.id);
        setProjects(projectsData);
      } catch (err) {
        setError(handleSupabaseError(err));
        console.error('Erreur lors du chargement des projets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !user) return;

    try {
      const newProject = await createProject(user.id, newProjectName, newProjectDesc);
      setProjects([
        {
          ...newProject,
          taskCount: 0,
          completedCount: 0,
        },
        ...projects,
      ]);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowForm(false);
    } catch (err) {
      setError(handleSupabaseError(err));
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
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

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>
            Mes Projets
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-lg btn-success"
          >
            + Créer un projet
          </button>
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

        {/* Formulaire Création Projet */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-body">
              <h2 className="card-title">Nouveau Projet</h2>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-control">
                  <label className="label">Nom du projet</label>
                  <input
                    type="text"
                    placeholder="Entrez le nom du projet"
                    className="input"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">Description</label>
                  <textarea
                    placeholder="Décrivez brièvement votre projet"
                    className="textarea"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des Projets */}
        <div className="grid" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {projects.map((project) => (
            <div key={project.id} className="card" style={{ transition: 'all 0.3s ease', height: '100%' }}>
              <div style={{
                height: '8rem',
                background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
              }} />
              <div className="card-body">
                <Link href={`/projects/${project.id}`}>
                  <h2 className="card-title" style={{ fontSize: '1.125rem', color: '#1f2937', cursor: 'pointer' }}>
                    {project.name}
                  </h2>
                </Link>
                <p style={{ color: '#4b5563', fontSize: '0.875rem', minHeight: '2.5rem' }}>
                  {project.description || 'Pas de description'}
                </p>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>Progression</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4a90e2' }}>
                      {project.completedCount || 0}/{project.taskCount || 0}
                    </span>
                  </div>
                  <progress
                    className="progress"
                    value={(project.taskCount || 0) > 0 ? ((project.completedCount || 0) / (project.taskCount || 0)) * 100 : 0}
                    max="100"
                  />
                </div>

                <div className="card-actions" style={{ marginTop: '1rem', gap: '0.5rem' }}>
                  <Link href={`/projects/${project.id}`} className="btn btn-primary" style={{ flex: 1 }}>
                    Voir les tâches
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="btn btn-error btn-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !showForm && (
          <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem' }}>
              Aucun projet pour le moment
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-lg btn-success"
            >
              Créer votre premier projet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
