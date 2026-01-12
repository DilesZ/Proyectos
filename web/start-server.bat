@echo off
echo Iniciando servidor local para IA Influencer...
echo.
echo Abre tu navegador y ve a: http://localhost:8080
echo.
echo Si tienes Python instalado:
python -m http.server 8080

if errorlevel 1 (
    echo Python no encontrado. Intentando con PHP...
    php -S localhost:8080
)

if errorlevel 1 (
    echo PHP no encontrado. Intentando con Node.js...
    npx http-server -p 8080
)

if errorlevel 1 (
    echo Ningun servidor encontrado.
    echo Por favor instala Python, PHP o Node.js para usar el servidor local.
    pause
)