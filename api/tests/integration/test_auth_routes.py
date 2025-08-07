import pytest
import os
from app.app import create_app


@pytest.fixture
def client():
    # Set test database URL for each test
    import tempfile
    temp_db = tempfile.NamedTemporaryFile(delete=False)
    os.environ["DATABASE_URL"] = f"sqlite:///{temp_db.name}"
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client
    # Clean up
    os.unlink(temp_db.name)


class TestAuthRoutes:
    def test_register_success(self, client):
        response = client.post("/register", json={
            "email": "newuser@example.com",
            "password": "password123"
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data["message"] == "User registered successfully"
        assert "user" in data
        assert data["user"]["email"] == "newuser@example.com"
    
    def test_register_duplicate_email(self, client):
        # Register first user
        client.post("/register", json={
            "email": "test@example.com", 
            "password": "password123"
        })
        
        # Try to register with same email
        response = client.post("/register", json={
            "email": "test@example.com",
            "password": "password456"
        })
        
        assert response.status_code == 409
        data = response.get_json()
        assert "already registered" in data["detail"].lower()
    
    def test_register_invalid_email(self, client):
        response = client.post("/register", json={
            "email": "invalid-email",
            "password": "password123"
        })
        
        assert response.status_code == 400
    
    def test_login_success(self, client):
        # Register user first
        client.post("/register", json={
            "email": "test@example.com",
            "password": "password123"
        })
        
        # Login
        response = client.post("/login", json={
            "email": "test@example.com",
            "password": "password123"
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self, client):
        response = client.post("/login", json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401
        data = response.get_json()
        assert "invalid credentials" in data["detail"].lower()
    
    def test_login_wrong_password(self, client):
        # Register user first
        client.post("/register", json={
            "email": "test@example.com",
            "password": "password123"
        })
        
        # Try with wrong password
        response = client.post("/login", json={
            "email": "test@example.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401