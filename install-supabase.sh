#!/bin/bash
# Script d'installation Supabase pour TaskFlow

set -e

echo "🚀 Installation de Supabase pour TaskFlow..."
echo ""

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Installer le package Supabase
echo "📦 Installation de @supabase/supabase-js..."
npm install @supabase/supabase-js

echo ""
echo "✅ Installation terminée!"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Vérifiez que .env.local contient vos credentials Supabase"
echo "2. Exécutez les scripts SQL dans SUPABASE_SQL.sql"
echo "3. Lancez votre application avec 'npm run dev'"
echo ""
echo "📚 Documentation:"
echo "- Guide rapide: SUPABASE_QUICKSTART.md"
echo "- Documentation complète: SUPABASE_SETUP.md"
echo ""
