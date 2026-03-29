'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      padding: '1.5rem'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '42rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem'
        }}>
          Bienvenue sur <span style={{ color: '#4a90e2' }}>TaskFlow</span>
        </h1>
        
        <p style={{
          fontSize: '1.125rem',
          color: '#4b5563',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          TaskFlow est votre solution complète pour gérer vos projets, organiser vos tâches 
          et collaborer efficacement en ligne. Commencez dès maintenant et transformez votre 
          productivité.
        </p>

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: '#4b5563' }}>
            <span style={{ fontSize: '1.875rem' }}>✓</span>
            <span>Gestion de projets simplifiée</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: '#4b5563' }}>
            <span style={{ fontSize: '1.875rem' }}>✓</span>
            <span>Suivi des tâches en temps réel</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: '#4b5563' }}>
            <span style={{ fontSize: '1.875rem' }}>✓</span>
            <span>Collaboration d'équipe intégrée</span>
          </div>
        </div>

        <Link 
          href="/login" 
          className="btn btn-lg btn-primary"
          style={{
            display: 'inline-flex',
            padding: '1rem 2rem',
            fontSize: '1.125rem',
            marginBottom: '2rem'
          }}
        >
          Commencer →
        </Link>

        <p style={{
          color: '#6b7280',
          marginTop: '2rem',
          fontSize: '0.875rem'
        }}>
          Gratuit pendant 30 jours. Aucune carte bancaire requise.
        </p>
      </div>
    </div>
  );
}