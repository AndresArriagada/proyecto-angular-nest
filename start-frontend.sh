#!/bin/bash

echo "======================================"
echo "Iniciando Frontend (Angular 11)..."
echo "======================================"

# Cargar nvm y usar Node v16
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 16 || nvm install 16

cd frontend/app
npm start
