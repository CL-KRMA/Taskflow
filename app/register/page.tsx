'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { signUp, signInWithGoogle, error: authError } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setLocalError('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      setSuccessMessage('Inscription réussie ! Redirection vers votre tableau de bord...');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirection vers le dashboard après 1 seconde
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erreur d\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLocalError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erreur d\'inscription avec Google');
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
            Créer un compte TaskFlow
          </h2>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

            {successMessage && (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                border: '1px solid #86efac'
              }}>
                {successMessage}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-control">
                <label className="label">Prénom</label>
                <input
                  type="text"
                  placeholder="Jean"
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Nom</label>
                <input
                  type="text"
                  placeholder="Dupont"
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

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
              <label className="label">
                <span className="label-text-alt" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Minimum 6 caractères
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="divider">Ou</div>

          <button
            onClick={handleGoogleRegister}
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
            {isLoading ? 'Inscription...' : 'S\'inscrire avec Google'}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#4b5563',
            marginTop: '1rem'
          }}>
            Vous avez déjà un compte?{' '}
            <Link href="/login" style={{ color: '#4a90e2', fontWeight: 'bold', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
