#!/bin/bash
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_NAME="backup_NexusHUB_$TIMESTAMP.tar.gz"

echo "🚀 Iniciando backup (formato tar.gz)..."

# Usando tar para evitar o erro de 'zip not found'
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='cache' \
    --exclude='*.map' \
    -zcf "$BACKUP_NAME" .

echo "✅ Backup concluído com sucesso: $BACKUP_NAME"
