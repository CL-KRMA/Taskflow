# TaskFlow - Application SaaS de Gestion de Projets

Bienvenue dans **TaskFlow**, votre plateforme complète de gestion de projets et tâches en ligne.

## 🌟 Fonctionnalités

### 5 Pages Principales

1. **Page Accueil** (`/`)
   - Présentation de TaskFlow
   - Bouton "Commencer" pour accéder à la connexion
   - Design moderne avec gradient bleu

2. **Page Connexion** (`/login`)
   - Formulaire de connexion classique
   - Option de connexion avec Google
   - Redirection automatique vers le tableau de bord

3. **Page Tableau de Bord** (`/dashboard`)
   - Vue d'ensemble des projets et statistiques
   - Accès rapide à "Mes Projets" et "Mon Profil"
   - Badges de progression

4. **Page Projets** (`/projects`)
   - Liste complète des projets
   - Création de nouveaux projets
   - Visualisation de la progression
   - Clic sur un projet pour voir ses tâches

5. **Page Tâches** (`/projects/[id]`)
   - Gestion des tâches par colonne (À faire, En cours, Terminé)
   - Ajout de nouvelles tâches
   - Changement de statut par dropdown
   - Suppression de tâches avec confirmation
   - Affichage de la priorité et des dates limites

## 🎨 Design & Styles

### Couleurs du Programme
- **Bleu Principal**: `#4a90e2`
- **Bleu Clair**: `#007aff`
- **Accent Jaune**: `#ffdd57`
- **Succès Vert**: `#10b981`
- **Erreur Rouge**: `#ef4444`
- **Fond Sombre**: `#1c1c1e`

### Technologies Utilisées
- **Next.js 16** - Framework React moderne
- **TailwindCSS 4** - Utilitaires CSS
- **DaisyUI 5** - Composants UI préconçus
- **TypeScript** - Type-safe development

## 🚀 Installation & Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:3000
```

## 📁 Structure du Projet

```
app/
├── page.tsx                    # Page d'accueil
├── login/
│   └── page.tsx               # Page de connexion
├── dashboard/
│   └── page.tsx               # Tableau de bord
├── projects/
│   ├── page.tsx               # Liste des projets
│   └── [id]/
│       └── page.tsx           # Détails et tâches du projet
├── components/
│   ├── Navbar.tsx             # Barre de navigation
│   └── Footer.tsx             # Pied de page
├── layout.tsx                 # Layout global
├── globals.css                # Styles globaux
└── page.tsx                   # Accueil
```

## 🔄 Navigation

- **Navbar**: Affichée sur toutes les pages (sauf accueil/login)
- **Footer**: Pied de page avec copyright
- **Liens de navigation**:
  - Logo TaskFlow → Accueil
  - Tableau de bord → Dashboard
  - Projets → Liste des projets
  - Déconnexion → Retour à l'accueil

## 💡 Utilisation

### Créer un Projet
1. Aller à `/projects`
2. Cliquer sur "+ Créer un projet"
3. Remplir le nom et la description
4. Cliquer sur "Créer"

### Ajouter une Tâche
1. Ouvrir un projet desde `/projects/[id]`
2. Cliquer sur "+ Ajouter une tâche"
3. Remplir les détails (titre, priorité, date limite)
4. Cliquer sur "Ajouter"

### Changer le Statut d'une Tâche
1. Cliquer sur le dropdown de statut d'une tâche
2. Sélectionner le nouveau statut
3. Le changement s'applique automatiquement

## 🎯 Données Simulées

L'application contient des données simulées pour démonstration:

**Projets préchargés:**
- Refonte du site web (5/8 tâches complétées)
- Application mobile (7/15 tâches complétées)
- Migration base de données (4/6 tâches complétées)

**Tâches d'exemple:**
- Créer les maquettes (COMPLÉTÉ)
- Développer les composants (EN COURS)
- Tests unitaires (À FAIRE)
- Déployer en production (À FAIRE)

## 🌈 Personnalisation

Vous pouvez personnaliser:
- Les couleurs dans `globals.css` (variables CSS)
- Les données simulées dans chaque page
- La structure des formulaires
- Les textes et libellés

## 📱 Responsive Design

L'application est entièrement responsive:
- 📱 Mobile (< 768px)
- 💻 Tablette (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔐 Authentification

Actuellement, l'authentification est simulée. Pour implémenter une véritable authentification:
1. Intégrer avec NextAuth.js
2. Connecter à una base de données (MongoDB, PostgreSQL, etc.)
3. Implémenter JWT ou sessions
4. Ajouter le Google OAuth

## 📊 État de l'Application

- ✅ Interface complète
- ✅ Navigation fonctionnelle
- ✅ CRUD basique pour projets et tâches
- ✅ Responsive design
- ✅ Styles modernes avec DaisyUI
- ⏳ Authentification (à implémenter)
- ⏳ Base de données (à ajouter)
- ⏳ Temps réel (à intégrer)

## 🛠️ Prochaines Étapes

1. **Intégrer une Base de Données**
   ```bash
   npm install mongodb
   # ou mongoose, prisma, etc.
   ```

2. **Ajouter l'Authentification**
   ```bash
   npm install next-auth@beta
   ```

3. **API Routes** (`app/api/`)
   - GET/POST projets
   - GET/POST/PUT/DELETE tâches
   - Authentification utilisateur

4. **Validation & Sécurité**
   - Zod ou Yup pour validation
   - Rate limiting
   - Sanitization des données

## 📝 Licence

Open source - Libre d'utilisation et de modification

## 💬 Support

Pour les questions ou améliorations, n'hésitez pas à créer une issue!

---

**Fait avec ❤️ en Next.js 16**
