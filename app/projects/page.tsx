'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Project {
  id: number;
  name: string;
  description: string;
  tasks: number;
  completed: number;
  color: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'Refonte du site web',
      description: 'Redesign complet du site corporate avec nouveau design system',
      tasks: 8,
      completed: 5,
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      name: 'Application mobile',
      description: 'Développement d\'une application iOS/Android pour nos clients',
      tasks: 15,
      completed: 7,
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 3,
      name: 'Migration base de données',
      description: 'Migration de PostgreSQL vers MongoDB pour améliorer la scalabilité',
      tasks: 6,
      completed: 4,
      color: 'from-green-400 to-green-600',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: projects.length + 1,
        name: newProjectName,
        description: newProjectDesc,
        tasks: 0,
        completed: 0,
        color: 'from-indigo-400 to-indigo-600',
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowForm(false);
      alert('Projet créé avec succès!');
    }
  };

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
            <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ transition: 'all 0.3s ease', height: '100%', cursor: 'pointer' }}>
                <div style={{
                  height: '8rem',
                  background: `linear-gradient(90deg, ${project.color === 'from-blue-400 to-blue-600' ? '#60a5fa, #2563eb' : project.color === 'from-purple-400 to-purple-600' ? '#a78bfa, #7c3aed' : project.color === 'from-green-400 to-green-600' ? '#4ade80, #16a34a' : '#818cf8, #4f46e5'})`
                }} />
                <div className="card-body">
                  <h2 className="card-title" style={{ fontSize: '1.125rem', color: '#1f2937' }}>
                    {project.name}
                  </h2>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', minHeight: '2.5rem' }}>
                    {project.description}
                  </p>

                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>Progression</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4a90e2' }}>
                        {project.completed}/{project.tasks}
                      </span>
                    </div>
                    <progress
                      className="progress"
                      value={project.tasks > 0 ? (project.completed / project.tasks) * 100 : 0}
                      max="100"
                    />
                  </div>

                  <div className="card-actions" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
                    <span className="badge badge-primary">
                      {project.tasks} tâches
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
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
