'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const router = useRouter();
  const { signIn, signInWithGoogle, error: authError } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erreur de connexion Google');
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || authError;

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
            {displayError && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                border: '1px solid #fca5a5'
              }}>
                {displayError}
              </div>
            )}

            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
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
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="divider">Ou</div>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline"
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
            >
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            {isLoading ? 'Connexion...' : 'Se connecter avec Google'}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#4b5563',
            marginTop: '1rem'
          }}>
            Pas encore de compte?{' '}
            <Link href="/register" style={{ color: '#4a90e2', fontWeight: 'bold', textDecoration: 'none' }}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
