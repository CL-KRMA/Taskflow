'use client';

import Link from 'next/link';

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div className="container">
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '3rem'
        }}>
          Tableau de bord
        </h1>

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
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  Gérer le profil
                </button>
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
                  <span className="badge badge-lg badge-primary">3</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Tâches totales:</span>
                  <span className="badge badge-lg badge-warning">12</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Tâches complétées:</span>
                  <span className="badge badge-lg badge-success">8</span>
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
                <button className="btn btn-outline" style={{
                  width: '100%',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  color: '#10b981',
                  borderColor: '#10b981'
                }}>
                  + Créer un nouveau projet
                </button>
                <button className="btn btn-outline" style={{
                  width: '100%',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  color: '#4a90e2',
                  borderColor: '#4a90e2'
                }}>
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
