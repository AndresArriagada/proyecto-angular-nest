#!/bin/bash

echo "======================================"
echo "Deteniendo servidores..."
echo "======================================"

# Detener procesos por nombre
pkill -f "ng serve" 2>/dev/null
pkill -f "nest start" 2>/dev/null
pkill -f "node.*main.js" 2>/dev/null

# Liberar puertos específicos
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:4200 | xargs kill -9 2>/dev/null

echo "✓ Servidores detenidos y puertos liberados"
