import pytest
import os
from datetime import date
from app.app import create_app


@pytest.fixture
def client():
    # Use in-memory database for each test to ensure clean schema
    os.environ["DATABASE_URL"] = "sqlite:///:memory:"
    app = create_app(testing=True)
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def auth_user(client):
    # Register and login a user, return auth token
    client.post("/register", json={
        "email": "test@example.com",
        "password": "password123"
    })
    
    response = client.post("/login", json={
        "email": "test@example.com", 
        "password": "password123"
    })
    
    token = response.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture  
def test_accounts(client, auth_user):
    # Create two accounts for testing transfers
    source_response = client.post("/accounts", 
        headers=auth_user,
        json={
            "name": "Source Account",
            "balance": 1000.0,
            "currency": "BRL"
        }
    )
    
    dest_response = client.post("/accounts",
        headers=auth_user,
        json={
            "name": "Destination Account", 
            "balance": 500.0,
            "currency": "BRL"
        }
    )
    
    source_account = source_response.get_json()["account"]
    dest_account = dest_response.get_json()["account"]
    
    return {
        "source": source_account,
        "destination": dest_account
    }


class TestTransferRoutes:
    def test_create_transfer_success(self, client, auth_user, test_accounts):
        transfer_data = {
            "description": "Test transfer",
            "amount": 200.0,
            "date": date.today().isoformat(),
            "from_account_id": test_accounts["source"]["id"],
            "to_account_id": test_accounts["destination"]["id"]
        }
        
        response = client.post("/transfers",
            headers=auth_user,
            json=transfer_data
        )
        
        assert response.status_code == 201
        data = response.get_json()
        assert data["message"] == "Transfer created successfully"
        assert data["transaction"]["type"] == "transfer"
        assert data["transaction"]["amount"] == 200.0
        assert data["transaction"]["account_id"] == test_accounts["source"]["id"]
        assert data["transaction"]["to_account_id"] == test_accounts["destination"]["id"]
    
    def test_create_transfer_validates_same_account(self, client, auth_user, test_accounts):
        transfer_data = {
            "description": "Invalid transfer",
            "amount": 100.0,
            "date": date.today().isoformat(),
            "from_account_id": test_accounts["source"]["id"],
            "to_account_id": test_accounts["source"]["id"]  # Same account
        }
        
        response = client.post("/transfers",
            headers=auth_user,
            json=transfer_data
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert "same account" in data["detail"].lower()
    
    def test_create_transfer_insufficient_balance(self, client, auth_user, test_accounts):
        transfer_data = {
            "description": "Too much transfer",
            "amount": 2000.0,  # More than source account balance
            "date": date.today().isoformat(),
            "from_account_id": test_accounts["source"]["id"], 
            "to_account_id": test_accounts["destination"]["id"]
        }
        
        response = client.post("/transfers",
            headers=auth_user,
            json=transfer_data
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert "insufficient balance" in data["detail"].lower()
    
    def test_create_transfer_nonexistent_account(self, client, auth_user, test_accounts):
        transfer_data = {
            "description": "Transfer to nowhere",
            "amount": 100.0,
            "date": date.today().isoformat(),
            "from_account_id": test_accounts["source"]["id"],
            "to_account_id": 99999  # Non-existent account
        }
        
        response = client.post("/transfers",
            headers=auth_user,
            json=transfer_data
        )
        
        assert response.status_code == 404
        data = response.get_json()
        assert "not found" in data["detail"].lower()
    
    def test_create_transfer_updates_balances(self, client, auth_user, test_accounts):
        initial_source_balance = test_accounts["source"]["balance"]
        initial_dest_balance = test_accounts["destination"]["balance"]
        transfer_amount = 300.0
        
        transfer_data = {
            "description": "Balance update test",
            "amount": transfer_amount,
            "date": date.today().isoformat(),
            "from_account_id": test_accounts["source"]["id"],
            "to_account_id": test_accounts["destination"]["id"]
        }
        
        # Make transfer
        transfer_response = client.post("/transfers",
            headers=auth_user,
            json=transfer_data
        )
        assert transfer_response.status_code == 201
        
        # Check updated balances
        accounts_response = client.get("/accounts", headers=auth_user)
        accounts = accounts_response.get_json()
        
        source_account = next(acc for acc in accounts if acc["id"] == test_accounts["source"]["id"])
        dest_account = next(acc for acc in accounts if acc["id"] == test_accounts["destination"]["id"])
        
        assert source_account["balance"] == initial_source_balance - transfer_amount
        assert dest_account["balance"] == initial_dest_balance + transfer_amount
    
    def test_transfer_appears_in_transactions_list(self, client, auth_user, test_accounts):
        transfer_data = {
            "description": "Listed transfer",
            "amount": 150.0,
            "date": date.today().isoformat(),
            "from_account_id": test_accounts["source"]["id"],
            "to_account_id": test_accounts["destination"]["id"]
        }
        
        # Create transfer
        client.post("/transfers", headers=auth_user, json=transfer_data)
        
        # Get transactions
        response = client.get("/transactions", headers=auth_user)
        transactions = response.get_json()
        
        # Find our transfer
        transfer_transaction = next((t for t in transactions if t["type"] == "transfer"), None)
        assert transfer_transaction is not None
        assert transfer_transaction["description"] == "Listed transfer"
        assert transfer_transaction["amount"] == 150.0
        assert transfer_transaction["category"] == "Transfer"
        assert transfer_transaction["account_id"] == test_accounts["source"]["id"]
        assert transfer_transaction["to_account_id"] == test_accounts["destination"]["id"]
    
    def test_create_transfer_requires_auth(self, client, test_accounts):
        transfer_data = {
            "description": "Unauthorized transfer",
            "amount": 100.0,
            "date": date.today().isoformat(),
            "from_account_id": 1,
            "to_account_id": 2
        }
        
        response = client.post("/transfers", json=transfer_data)
        assert response.status_code == 401