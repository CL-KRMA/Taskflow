'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getProjects } from '@/lib/supabase-utils';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        setStatsLoading(true);
        
        // Charger les projets
        const projects = await getProjects(user.id);
        setActiveProjects(projects.length);
        
        // Charger toutes les tâches de l'utilisateur
        const { data: tasks, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (tasks) {
          setTotalTasks(tasks.length);
          const completed = tasks.filter(task => task.status === 'done').length;
          setCompletedTasks(completed);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    loadStats();
  }, [user]);

  const handleCreateProject = () => {
    router.push('/projects');
  };

  const handleAddTask = () => {
    router.push('/projects');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user.email?.split('@')[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Bienvenue, {displayName}! 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Email: {user.email}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Carte Mes Projets */}
          <div className="card" style={{ transition: 'all 0.3s ease' }}>
            <div className="card-body">
              <h2 className="card-title" style={{ fontSize: '1.5rem', color: '#4a90e2', marginBottom: '1rem' }}>
                📁 Mes Projets
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                Accédez à tous vos projets, créez-en de nouveaux et gérez vos équipes.
              </p>
              <div className="card-actions">
                <Link
                  href="/projects"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Voir mes projets
                </Link>
              </div>
            </div>
          </div>

          {/* Carte Mon Profil */}
          <div className="card" style={{ transition: 'all 0.3s ease' }}>
            <div className="card-body">
              <h2 className="card-title" style={{ fontSize: '1.5rem', color: '#4a90e2', marginBottom: '1rem' }}>
                👤 Mon Profil
              </h2>
              <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                Modifiez vos informations personnelles, votre mot de passe et vos préférences.
              </p>
              <div className="card-actions">
                <Link
                  href="/profile"
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  Éditer le profil
                </Link>
              </div>
            </div>
          </div>

          {/* Carte Statistiques */}
          <div className="card" style={{ transition: 'all 0.3s ease' }}>
            <div className="card-body">
              <h2 className="card-title" style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '1rem' }}>
                📊 Statistiques
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Projets actifs:</span>
                  <span className="badge badge-lg badge-primary">{statsLoading ? '...' : activeProjects}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Tâches totales:</span>
                  <span className="badge badge-lg badge-warning">{statsLoading ? '...' : totalTasks}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Tâches complétées:</span>
                  <span className="badge badge-lg badge-success">{statsLoading ? '...' : completedTasks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carte Actions */}
          <div className="card" style={{ transition: 'all 0.3s ease' }}>
            <div className="card-body">
              <h2 className="card-title" style={{ fontSize: '1.5rem', color: '#7c3aed', marginBottom: '1rem' }}>
                ⚙️ Actions Rapides
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={handleCreateProject}
                  className="btn btn-outline" 
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    color: '#10b981',
                    borderColor: '#10b981'
                  }}
                >
                  + Créer un nouveau projet
                </button>
                <button 
                  onClick={handleAddTask}
                  className="btn btn-outline" 
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    color: '#4a90e2',
                    borderColor: '#4a90e2'
                  }}
                >
                  + Ajouter une tâche
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
