'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);
  const MAX_ATTEMPTS = 10;
  const BLOCK_DURATION_MINUTES = 15;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile && user) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(user.email || '');
    }
  }, [profile, user]);

  // Timer de déblocage automatique
  useEffect(() => {
    if (!blockedUntil) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((blockedUntil.getTime() - now.getTime()) / 1000));

      if (remaining === 0) {
        // Déblocage automatique
        setBlockedUntil(null);
        setFailedAttempts(0);
        setCountdown(0);
        setCurrentPassword('');
        setMessage({
          type: 'success',
          text: 'Compte débloqué! Vous pouvez réessayer maintenant.',
        });
        clearInterval(interval);
      } else {
        setCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Profil mis à jour avec succès!',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erreur lors de la mise à jour',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier si le compte est bloqué
    if (blockedUntil) {
      const minutesRemaining = Math.ceil(countdown / 60);
      setMessage({
        type: 'error',
        text: `🔒 Compte temporairement bloqué. Réessayez dans ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''} (${countdown}s restantes).`,
      });
      return;
    }

    if (!currentPassword.trim()) {
      setMessage({
        type: 'error',
        text: 'Veuillez entrer votre mot de passe actuel',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Vérifier que le mot de passe actuel est correct
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: currentPassword,
      });

      if (signInError) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        if (newFailedAttempts >= MAX_ATTEMPTS) {
          // Bloquer pour BLOCK_DURATION_MINUTES
          const now = new Date();
          const blockTime = new Date(now.getTime() + BLOCK_DURATION_MINUTES * 60 * 1000);
          setBlockedUntil(blockTime);
          setCountdown(BLOCK_DURATION_MINUTES * 60);

          setMessage({
            type: 'error',
            text: `🔒 Compte bloqué! Trop de tentatives échouées (${newFailedAttempts}/${MAX_ATTEMPTS}). Déblocage automatique dans ${BLOCK_DURATION_MINUTES} minutes.`,
          });
          setCurrentPassword('');
          setIsLoading(false);
          return;
        }

        setMessage({
          type: 'error',
          text: `Mot de passe incorrect. Tentatives restantes: ${MAX_ATTEMPTS - newFailedAttempts}/${MAX_ATTEMPTS}`,
        });
        setCurrentPassword('');
        setIsLoading(false);
        return;
      }

      // Réinitialiser les tentatives en cas de succès
      setFailedAttempts(0);
      setBlockedUntil(null);
      setCountdown(0);

      setMessage({
        type: 'success',
        text: 'Mot de passe vérifié! Entrez votre nouveau mot de passe.',
      });

      setPasswordVerified(true);
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setMessage({
        type: 'error',
        text: 'Veuillez remplir tous les champs de mot de passe',
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: 'error',
        text: 'Le nouveau mot de passe doit contenir au moins 6 caractères',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Les mots de passe ne correspondent pas',
      });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({
        type: 'error',
        text: 'Le nouveau mot de passe doit être différent de l\'actuel',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Maintenant changer le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('Erreur Supabase:', updateError);
        throw new Error(updateError.message || 'Impossible de mettre à jour le mot de passe');
      }

      setMessage({
        type: 'success',
        text: 'Mot de passe mis à jour avec succès! Veuillez vous reconnecter.',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordVerified(false);

      // Forcer la déconnexion explicitement
      setTimeout(async () => {
        await supabase.auth.signOut();
        setShowPasswordForm(false);
        router.push('/login');
      }, 2000);
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du mot de passe';
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <Link href="/dashboard" className="link" style={{ marginBottom: '1rem', display: 'block' }}>
          ← Retour au tableau de bord
        </Link>

        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Mon Profil
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
          Modifiez vos informations personnelles
        </p>

        {message && (
          <div
            style={{
              backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: message.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5',
            }}
          >
            {message.text}
          </div>
        )}

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Email (lecture seule) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="input"
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
                <label className="label">
                  <span className="label-text-alt" style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    L'email ne peut pas être modifié
                  </span>
                </label>
              </div>

              {/* Prénom */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Prénom</span>
                </label>
                <input
                  type="text"
                  placeholder="Jean"
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Nom */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom</span>
                </label>
                <input
                  type="text"
                  placeholder="Dupont"
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Boutons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {isLoading ? 'Mise à jour...' : 'Enregistrer les modifications'}
                </button>
                <Link href="/dashboard" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                  Annuler
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Section Compte */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-body">
            <h2 className="card-title" style={{ color: '#1f2937', marginBottom: '1rem' }}>
              Compte
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4b5563' }}>Compte créé le:</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : '-'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4b5563' }}>Dernière modification:</span>
                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('fr-FR') : '-'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="btn btn-warning"
              style={{ width: '100%' }}
            >
              {showPasswordForm ? '✕ Fermer' : '🔐 Changer le mot de passe'}
            </button>
          </div>
        </div>

        {/* Formulaire Changement Mot de Passe */}
        {showPasswordForm && (
          <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid #f59e0b' }}>
            <div className="card-body">
              <h2 className="card-title" style={{ color: '#1f2937', marginBottom: '1rem' }}>
                Changer le mot de passe
              </h2>
              
              <div style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                border: '1px solid #fcd34d'
              }}>
                ⚠️ Vous serez déconnecté après le changement de mot de passe
              </div>

              {/* ÉTAPE 1: Vérification du mot de passe actuel */}
              {!passwordVerified ? (
                <>
                  {blockedUntil && (
                    <div style={{
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      marginBottom: '1rem',
                      fontSize: '0.875rem',
                      border: '1px solid #fca5a5'
                    }}>
                      🔒 <strong>Compte bloqué pour ${Math.ceil(countdown / 60)} minute{Math.ceil(countdown / 60) > 1 ? 's' : ''}</strong><br/>
                      Trop de tentatives échouées ({failedAttempts}/{MAX_ATTEMPTS}). Déblocage automatique dans:<br/>
                      <strong style={{ fontSize: '1.25rem', color: '#dc2626' }}>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</strong>
                    </div>
                  )}

                  {failedAttempts > 0 && !blockedUntil && (
                    <div style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      marginBottom: '1rem',
                      fontSize: '0.875rem',
                      border: '1px solid #fcd34d'
                    }}>
                      ⚠️ Mot de passe incorrect. Tentatives restantes: <strong>{MAX_ATTEMPTS - failedAttempts}/{MAX_ATTEMPTS}</strong>
                    </div>
                  )}

                  <form onSubmit={handleVerifyPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Mot de passe actuel</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Entrez votre mot de passe actuel"
                        className="input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={isLoading || !!blockedUntil}
                        required
                      />
                      <label className="label">
                        <span className="label-text-alt">Vérification de sécurité requise</span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button
                        type="submit"
                        disabled={isLoading || !!blockedUntil}
                        className="btn btn-warning"
                        style={{ flex: 1 }}
                      >
                        {isLoading ? '⏳ Vérification...' : '✓ Vérifier le mot de passe'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordVerified(false);
                          setMessage(null);
                        }}
                        className="btn btn-outline"
                        style={{ flex: 1 }}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                /* ÉTAPE 2: Changement du mot de passe */
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nouveau mot de passe</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Au moins 6 caractères"
                      className="input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <label className="label">
                      <span className="label-text-alt">Minimum 6 caractères</span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Confirmer le mot de passe</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Confirmez le mot de passe"
                      className="input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-success"
                      style={{ flex: 1 }}
                    >
                      {isLoading ? '⏳ Mise à jour en cours...' : '✓ Mettre à jour le mot de passe'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordVerified(false);
                        setNewPassword('');
                        setConfirmPassword('');
                        setMessage(null);
                      }}
                      className="btn btn-outline"
                      style={{ flex: 1 }}
                    >
                      ← Retour
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
