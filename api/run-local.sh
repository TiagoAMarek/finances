#!/bin/bash

# Script para rodar a API Flask localmente
# Execute com: ./run-local.sh ou bash run-local.sh

set -e  # Para em caso de erro

echo "🚀 Iniciando API Flask localmente..."

# Verificar se o virtual environment existe
if [ ! -d "venv" ]; then
    echo "📦 Criando virtual environment..."
    python3 -m venv venv
fi

# Ativar virtual environment
echo "🔧 Ativando virtual environment..."
source venv/bin/activate

# Instalar dependências se necessário
echo "📚 Verificando dependências..."
pip install -r requirements.txt --quiet

# Carregar variáveis de ambiente
if [ -f "../.env" ]; then
    echo "🔐 Carregando variáveis de ambiente do .env"
    export $(grep -v '^#' ../.env | xargs)
fi

# Verificar se as tabelas existem, senão criar
echo "🗄️  Verificando tabelas do banco de dados..."
PYTHONPATH=. python -c "
try:
    from app.database import create_tables
    create_tables()
    print('✅ Tabelas verificadas/criadas')
except Exception as e:
    print(f'⚠️  Erro ao verificar tabelas: {e}')
"

# Rodar o servidor Flask
echo "🌐 Iniciando servidor Flask em http://localhost:8000"
echo "📝 Pressione Ctrl+C para parar o servidor"
echo ""

PYTHONPATH=. python main.py