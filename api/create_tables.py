#!/usr/bin/env python3
"""
Script para criar as tabelas do banco de dados.
Execute com: python create_tables.py
"""

import os
import sys
from pathlib import Path

# Adicionar o diretório pai ao path para importar os módulos
sys.path.insert(0, str(Path(__file__).parent))

# Carregar variáveis de ambiente do .env.local
from dotenv import load_dotenv
import os
load_dotenv('../.env.local')

# Importar todos os modelos para que sejam registrados no Base.metadata
from app.models.user import User
from app.models.account import BankAccount
from app.models.transaction import Transaction
from app.database import create_tables

def main():
    print("🔧 Criando tabelas no banco de dados...")
    
    try:
        create_tables()
        print("✅ Tabelas criadas com sucesso!")
        print("📊 Tabelas disponíveis:")
        print("   - users (usuários)")
        print("   - bank_accounts (contas bancárias)")
        print("   - transactions (transações)")
        
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()