@echo off
title Servidor Local - Juridico Supra Legis
echo ===================================================
echo   Iniciando servidor local...
echo ===================================================
echo Abriendo el navegador en http://localhost:3000
start http://localhost:3000
npx serve -l 3000 .
pause
