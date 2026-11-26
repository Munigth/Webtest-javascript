@echo off
title OCR Image vers Word - serveur local
cd /d "%~dp0"

where py >nul 2>&1
if %errorlevel%==0 (
    echo Serveur local : http://127.0.0.1:8765
    echo Ferme cette fenetre pour arreter le serveur.
    start "" "http://127.0.0.1:8765/index.html"
    py -m http.server 8765
    goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
    echo Serveur local : http://127.0.0.1:8765
    echo Ferme cette fenetre pour arreter le serveur.
    start "" "http://127.0.0.1:8765/index.html"
    python -m http.server 8765
    goto :eof
)

echo Python n'est pas installe.
echo.
echo Solution :
echo 1. Installe Python 3.
echo 2. Relance lancer.bat
echo.
pause
