'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    alert('Connexion avec Google - Redirection vers le tableau de bord');
    window.location.href = '/dashboard';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      alert(`Connexion réussie avec ${email}`);
      window.location.href = '/dashboard';
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
    }}>
      <div className="card" style={{ width: '24rem' }}>
        <div className="card-body">
          <h2 className="card-title" style={{ 
            fontSize: '1.5rem',
            textAlign: 'center',
            color: '#4a90e2',
            marginBottom: '1.5rem'
          }}>
            Connexion à TaskFlow
          </h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Se connecter
            </button>
          </form>

          <div className="divider">Ou</div>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
            >
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            Se connecter avec Google
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#4b5563',
            marginTop: '1rem'
          }}>
            Pas encore de compte?{' '}
            <Link href="/" style={{ color: '#4a90e2', fontWeight: 'bold', textDecoration: 'none' }}>
              Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
