#!/bin/bash

echo "======================================"
echo "Deteniendo servidores..."
echo "======================================"

pkill -f "ng serve"
pkill -f "nest start"

echo "✓ Servidores detenidos"
