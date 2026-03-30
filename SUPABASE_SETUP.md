# Intégration Supabase - Guide de configuration

## ✅ Étapes complétées

1. **Client Supabase** (`lib/supabase.ts`)
   - Client Supabase configuré et réutilisable
   - Utilise les variables d'environnement

2. **Contexte d'authentification** (`lib/auth-context.tsx`)
   - Gestion centralisée de l'état utilisateur
   - Fonctions: `signIn`, `signUp`, `signOut`, `signInWithGoogle`
   - Écoute automatique des changements d'authentification

3. **Hook personnalisé** (`lib/useAuth.ts`)
   - Accès facile aux fonctions d'authentification depuis n'importe quel composant

4. **Pages adaptées**
   - **Login**: Authentification Supabase avec gestion d'erreurs
   - **Dashboard**: Protection de route pour utilisateurs connectés
   - **Navbar**: Affichage d'email et bouton de déconnexion

## 🚀 Prochaines étapes

### 1. Installer les dépendances
```bash
npm install @supabase/supabase-js
```

### 2. Configurer les variables d'environnement
Assurez-vous que `.env.local` contient :
```
NEXT_PUBLIC_SUPABASE_URL=https://efqahrimjvjnawqmqwbm.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_qufX_ingpKbwsBcapdV4mw_zCBA77K9
```

### 3. Configurer Supabase Console
1. Allez à https://supabase.com et connectez-vous
2. Activez l'authentification email/password
3. (Optionnel) Configurez Google OAuth

### 4. Créer des tables Supabase pour vos données
Exemple pour une table `projects` :
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs ne voient que leurs propres projets
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. Ajouter une protection de routes supplémentaires
Créer un middleware pour protéger les routes privées :

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './lib/supabase';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes publiques
  const publicRoutes = ['/', '/login'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Vérifier la session pour les routes privées
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*'],
};
```

### 6. Intégrer l'API Supabase dans les composants
Exemple pour créer un projet :

```typescript
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';

export default function CreateProject() {
  const { user } = useAuth();

  const createProject = async (name: string) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: user?.id,
          name,
        }
      ])
      .select();

    if (error) {
      console.error('Erreur:', error.message);
    } else {
      console.log('Projet créé:', data);
    }
  };

  return (
    <button onClick={() => createProject('Mon nouveau projet')}>
      Créer un projet
    </button>
  );
}
```

## 📋 Fonctionnalités d'authentification disponibles

### useAuth Hook
```typescript
const { user, session, loading, error, signIn, signUp, signOut, signInWithGoogle } = useAuth();
```

## 🔒 Recommandations de sécurité

1. **Utilisez l'authentification par email confirmé**
   - Configurez les templates d'email de confirmation dans Supabase

2. **Mettez en place les Row Level Security (RLS)**
   - Toutes les tables doivent avoir des politiques RLS

3. **Stockez les données sensibles** en base de données, pas en cookie

4. **Validez toujours côté serveur** les modifications de données important

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Authentification Supabase](https://supabase.com/docs/guides/auth)
