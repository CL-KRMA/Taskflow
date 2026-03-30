@echo off
REM Script d'installation Supabase pour TaskFlow (Windows)

echo 🚀 Installation de Supabase pour TaskFlow...
echo.

REM Vérifier si npm est installé
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm n'est pas trouvé. Veuillez installer Node.js d'abord.
    pause
    exit /b 1
)

REM Installer le package Supabase
echo 📦 Installation de @supabase/supabase-js...
call npm install @supabase/supabase-js

echo.
echo ✅ Installation terminée!
echo.
echo 📝 Prochaines étapes:
echo 1. Vérifiez que .env.local contient vos credentials Supabase
echo 2. Exécutez les scripts SQL dans SUPABASE_SQL.sql
echo 3. Lancez votre application avec 'npm run dev'
echo.
echo 📚 Documentation:
echo - Guide rapide: SUPABASE_QUICKSTART.md
echo - Documentation complète: SUPABASE_SETUP.md
echo.
pause
