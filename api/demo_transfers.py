#!/usr/bin/env python3
"""
Demo script para testar transferências entre contas.
Execute com: python demo_transfers.py
"""

import requests
import json
from datetime import date

# Configurações
BASE_URL = "http://localhost:8000"
headers = {"Content-Type": "application/json"}

def demo():
    print("🔄 Demo: Transferências entre contas")
    print("=" * 50)
    
    # 1. Registrar usuário
    print("1. Registrando usuário...")
    register_data = {
        "email": "demo@example.com",
        "password": "demo123"
    }
    
    response = requests.post(f"{BASE_URL}/register", json=register_data, headers=headers)
    if response.status_code == 201:
        print("✅ Usuário registrado")
    else:
        print(f"❌ Erro ao registrar: {response.text}")
        return
    
    # 2. Fazer login
    print("2. Fazendo login...")
    response = requests.post(f"{BASE_URL}/login", json=register_data, headers=headers)
    if response.status_code == 200:
        token = response.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {token}", **headers}
        print("✅ Login realizado")
    else:
        print(f"❌ Erro no login: {response.text}")
        return
    
    # 3. Criar contas
    print("3. Criando contas...")
    
    # Conta corrente
    cc_data = {
        "name": "Conta Corrente",
        "balance": 5000.0,
        "currency": "BRL"
    }
    response = requests.post(f"{BASE_URL}/accounts", json=cc_data, headers=auth_headers)
    cc_id = response.json()["account"]["id"]
    print(f"✅ Conta Corrente criada (ID: {cc_id}, Saldo: R$ 5.000,00)")
    
    # Poupança
    poup_data = {
        "name": "Poupança",
        "balance": 1000.0,
        "currency": "BRL"
    }
    response = requests.post(f"{BASE_URL}/accounts", json=poup_data, headers=auth_headers)
    poup_id = response.json()["account"]["id"]
    print(f"✅ Poupança criada (ID: {poup_id}, Saldo: R$ 1.000,00)")
    
    # 4. Fazer transferência
    print("\n4. Fazendo transferência da Conta Corrente para Poupança...")
    transfer_data = {
        "description": "Transferência para poupança",
        "amount": 1500.0,
        "date": date.today().isoformat(),
        "from_account_id": cc_id,
        "to_account_id": poup_id
    }
    
    response = requests.post(f"{BASE_URL}/transfers", json=transfer_data, headers=auth_headers)
    if response.status_code == 201:
        transfer = response.json()["transaction"]
        print(f"✅ Transferência realizada: R$ {transfer['amount']}")
        print(f"   - De: Conta {transfer['account_id']} → Para: Conta {transfer['to_account_id']}")
    else:
        print(f"❌ Erro na transferência: {response.text}")
        return
    
    # 5. Verificar saldos atualizados
    print("\n5. Verificando saldos após transferência...")
    response = requests.get(f"{BASE_URL}/accounts", headers=auth_headers)
    accounts = response.json()
    
    for account in accounts:
        if account["id"] == cc_id:
            print(f"   Conta Corrente: R$ {account['balance']:,.2f}")
        elif account["id"] == poup_id:
            print(f"   Poupança: R$ {account['balance']:,.2f}")
    
    # 6. Ver histórico de transações
    print("\n6. Histórico de transações:")
    response = requests.get(f"{BASE_URL}/transactions", headers=auth_headers)
    transactions = response.json()
    
    for t in transactions:
        if t["type"] == "transfer":
            print(f"   ↔️  {t['description']}: R$ {t['amount']} ({t['date']})")
    
    print("\n✨ Demo concluída com sucesso!")

if __name__ == "__main__":
    try:
        demo()
    except requests.exceptions.ConnectionError:
        print("❌ Erro: Servidor não está rodando.")
        print("   Execute: python main.py")
    except KeyboardInterrupt:
        print("\n👋 Demo interrompida pelo usuário.")