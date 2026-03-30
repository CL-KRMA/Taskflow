'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';

/**
 * Exemple d'utilisation de Supabase dans l'application
 * Ce fichier montre comment:
 * 1. Utiliser le hook useAuth
 * 2. Appeler les APIs Supabase
 * 3. Gérer les données
 */

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export function ProjectsExample() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Exemple 1 : Créer un projet
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProjectName,
          description: '',
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject[0]]);
        setNewProjectName('');
      }
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Exemple 2 : Récupérer les projets
  const handleFetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <div>Non authentifié</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mes Projets</h2>
      
      {/* Formulaire de création */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Nom du projet"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="input"
        />
        <button
          onClick={handleCreateProject}
          disabled={isCreating}
          className="btn btn-primary"
        >
          {isCreating ? 'Création...' : 'Créer'}
        </button>
        <button
          onClick={handleFetchProjects}
          className="btn btn-outline"
        >
          Rafraîchir
        </button>
      </div>

      {/* Liste des projets */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.length === 0 ? (
          <p>Aucun projet. Créez-en un!</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="card"
              style={{ backgroundColor: '#fff' }}
            >
              <div className="card-body">
                <h3 style={{ color: '#4a90e2', marginBottom: '0.5rem' }}>
                  {project.name}
                </h3>
                {project.description && (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {project.description}
                  </p>
                )}
                <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                  Créé: {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
