# 🔐 INTÉGRATION SUPABASE - GUIDE RAPIDE

## ✅ Fichiers créés

| Fichier | Description |
|---------|-------------|
| `lib/supabase.ts` | Client Supabase |
| `lib/auth-context.tsx` | Contexte d'authentification |
| `lib/useAuth.ts` | Hook pour accéder à l'auth |
| `lib/ProtectedRoute.tsx` | Composant de protection de route |
| `lib/supabase-utils.ts` | Fonctions utilitaires |
| `lib/ProjectsExample.tsx` | Exemple d'utilisation |
| `app/api/projects/route.ts` | API exemple pour les projets |
| `SUPABASE_SQL.sql` | Scripts SQL pour la base de données |
| `SUPABASE_SETUP.md` | Documentation complète |

## 🚀 DÉMARRAGE RAPIDE (2 minutes)

### 1️⃣ Installer Supabase
```bash
npm install @supabase/supabase-js
```

### 2️⃣ Vérifier `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://efqahrimjvjnawqmqwbm.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_...
```

*Note: Utilisez les variables avec le préfixe `NEXT_PUBLIC_` pour le navigateur*

### 3️⃣ Exécuter les scripts SQL
1. Allez à https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Ouvrez l'onglet **SQL Editor**
4. Copiez-collez le contenu de `SUPABASE_SQL.sql`
5. Cliquez sur **Run**

### 4️⃣ Activer Google OAuth (optionnel)
Dans Supabase Dashboard:
- **Authentication** → **Providers**
- Activez **Google**, entrez vos credentials
- URL de redirection: `http://localhost:3000/dashboard` (développement)

### 5️⃣ Tester localement
```bash
npm run dev
# Visitez http://localhost:3000/login
```

## 📌 FONCTIONNALITÉS PAR DÉFAUT

✅ **Enregistrement/Connexion** email & mot de passe  
✅ **Googlelogin** (via OAuth)  
✅ **Session persistante**  
✅ **Protection de routes**  
✅ **Gestion d'erreurs**  
✅ **API pour les projets**  

## 💡 COMMENT UTILISER

### Dans un composant (côté client)
```typescript
import { useAuth } from '@/lib/useAuth';

export function MyComponent() {
  const { user, signOut, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;
  if (!user) return <div>Non connecté</div>;

  return (
    <div>
      <p>Bienvenue, {user.email}!</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
}
```

### Appeler une API
```typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  body: JSON.stringify({ name: 'Mon projet' }),
  headers: { 'Content-Type': 'application/json' },
});
```

### Utiliser les utilitaires Supabase
```typescript
import { getProjects, createProject } from '@/lib/supabase-utils';

const projects = await getProjects(userId);
const newProject = await createProject(userId, 'Nouveau projet');
```

## 🔒 SÉCURITÉ

✅ **RLS (Row Level Security)** configuré sur toutes les tables  
✅ **Variables sensibles** en `.env.local` (gitignored)  
✅ **Validations côté serveur** dans les API routes  

## 📊 STRUCTURE DE BASE DE DONNÉES

```
projects/
├── id (UUID)
├── user_id (UUID → auth.users)
├── name (VARCHAR)
├── description (TEXT)
├── created_at, updated_at

tasks/
├── id (UUID)
├── project_id (UUID → projects)
├── user_id (UUID → auth.users)
├── title, description, status, priority

galleries/
├── id (UUID)
├── user_id (UUID → auth.users)
├── project_id (UUID → projects)
```

## ❓ QUESTIONS FRÉQUENTES

**Q: Où stocker les fichiers?**  
R: Utilisez Supabase Storage (bucket) et stockez les URLs en base de données

**Q: Comment gérer des rôles d'utilisateurs?**  
R: Ajoutez une colonne `role` dans une table `profiles` et utilisez-la dans les politiques RLS

**Q: Comment faire du real-time?**  
R: Utilisez `subscribeToProjects()` de `supabase-utils.ts`

**Q: La page se charge lentement au démarrage?**  
R: C'est normal, la session vérifie la personne connectée. Vous pouvez ajouter un skeleton loader.

## 📚 RESSOURCES

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)

---

✨ **Prêt à construire!** Consultez `SUPABASE_SETUP.md` pour une documentation complète.
