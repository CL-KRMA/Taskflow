'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextType } from './auth-context';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth doit être utilisé uniquement dans un composant enveloppé par AuthProvider');
  }

  return context;
}
