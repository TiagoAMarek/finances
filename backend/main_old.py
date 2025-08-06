from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Date, extract
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from passlib.context import CryptContext
from datetime import date
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configuração do JWT
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Mude isso em produção!
jwt = JWTManager(app)

# Configuração do Banco de Dados SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./financas.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Contexto para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelo de Usuário
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    accounts = relationship("BankAccount", back_populates="owner")
    credit_cards = relationship("CreditCard", back_populates="owner")
    transactions = relationship("Transaction", back_populates="owner")

# Modelo de Conta Bancária
class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    balance = Column(Float, default=0.0)
    currency = Column(String, default="BRL")
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="bank_account")

# Modelo de Cartão de Crédito
class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    limit = Column(Float, default=0.0)
    current_bill = Column(Float, default=0.0)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="credit_cards")
    transactions = relationship("Transaction", back_populates="credit_card")

# Modelo de Transação
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    type = Column(String)  # 'income' or 'expense'
    date = Column(Date)
    category = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(Integer, ForeignKey("bank_accounts.id"), nullable=True)
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)

    owner = relationship("User", back_populates="transactions")
    bank_account = relationship("BankAccount", back_populates="transactions")
    credit_card = relationship("CreditCard", back_populates="transactions")

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Dependência para obter a sessão do DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.route("/")
def read_root():
    return {"Hello": "World from Flask"}

# Rota de Registro
@app.route("/register", methods=["POST"])
def register_user():
    db = next(get_db())
    user_data = request.json
    email = user_data.get("email")
    password = user_data.get("password")

    if db.query(User).filter(User.email == email).first():
        return jsonify({"detail": "Email already registered"}), 400

    hashed_password = pwd_context.hash(password)
    new_user = User(email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return jsonify({"message": "User registered successfully", "user_id": new_user.id}), 201

# Rota de Login
@app.route("/login", methods=["POST"])
def login_user():
    db = next(get_db())
    user_data = request.json
    email = user_data.get("email")
    password = user_data.get("password")

    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password, user.hashed_password):
        return jsonify({"detail": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

@jwt.user_identity_loader
def user_identity_lookup(user_id):
    return str(user_id)

# Rotas para Contas Bancárias
@app.route("/accounts", methods=["POST"])
@jwt_required()
def create_bank_account():
    db = next(get_db())
    user_id = str(get_jwt_identity())
    account_data = request.json

    new_account = BankAccount(
        name=account_data.get("name"),
        balance=account_data.get("balance", 0.0),
        currency=account_data.get("currency", "BRL"),
        owner_id=user_id,
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return jsonify({
        "message": "Account created successfully",
        "account": {
            "id": new_account.id,
            "name": new_account.name,
            "balance": new_account.balance,
            "currency": new_account.currency,
            "owner_id": new_account.owner_id,
        },
    }), 201

@app.route("/accounts", methods=["GET"])
@jwt_required()
def get_bank_accounts():
    db = next(get_db())
    user_id = str(get_jwt_identity())

    accounts = db.query(BankAccount).filter(BankAccount.owner_id == user_id).all()
    return jsonify([
        {
            "id": account.id,
            "name": account.name,
            "balance": account.balance,
            "currency": account.currency,
            "owner_id": account.owner_id,
        }
        for account in accounts
    ]), 200

@app.route("/accounts/<int:account_id>", methods=["PUT"])
@jwt_required()
def update_bank_account(account_id):
    db = next(get_db())
    user_id = str(get_jwt_identity())
    account = db.query(BankAccount).filter(BankAccount.id == account_id, BankAccount.owner_id == user_id).first()
    if not account:
        return jsonify({"detail": "Account not found or not authorized"}), 404

    update_data = request.json
    account.name = update_data.get("name", account.name)
    account.balance = update_data.get("balance", account.balance)
    account.currency = update_data.get("currency", account.currency)
    db.commit()
    db.refresh(account)

    return jsonify({
        "message": "Account updated successfully",
        "account": {
            "id": account.id,
            "name": account.name,
            "balance": account.balance,
            "currency": account.currency,
            "owner_id": account.owner_id,
        },
    }), 200

@app.route("/accounts/<int:account_id>", methods=["DELETE"])
@jwt_required()
def delete_bank_account(account_id):
    db = next(get_db())
    user_id = str(get_jwt_identity())
    account = db.query(BankAccount).filter(BankAccount.id == account_id, BankAccount.owner_id == user_id).first()
    if not account:
        return jsonify({"detail": "Account not found or not authorized"}), 404

    db.delete(account)
    db.commit()

    return jsonify({"message": "Account deleted successfully"}), 204

# Rotas para Cartões de Crédito
@app.route("/credit_cards", methods=["POST"])
@jwt_required()
def create_credit_card():
    db = next(get_db())
    user_id = str(get_jwt_identity())
    card_data = request.json

    new_card = CreditCard(
        name=card_data.get("name"),
        limit=card_data.get("limit", 0.0),
        current_bill=card_data.get("current_bill", 0.0),
        owner_id=user_id,
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return jsonify({
        "message": "Credit card created successfully",
        "card": {
            "id": new_card.id,
            "name": new_card.name,
            "limit": new_card.limit,
            "current_bill": new_card.current_bill,
            "owner_id": new_card.owner_id,
        },
    }), 201

@app.route("/credit_cards", methods=["GET"])
@jwt_required()
def get_credit_cards():
    db = next(get_db())
    user_id = str(get_jwt_identity())

    cards = db.query(CreditCard).filter(CreditCard.owner_id == user_id).all()
    return jsonify([
        {
            "id": card.id,
            "name": card.name,
            "limit": card.limit,
            "current_bill": card.current_bill,
            "owner_id": card.owner_id,
        }
        for card in cards
    ]), 200

@app.route("/credit_cards/<int:card_id>", methods=["PUT"])
@jwt_required()
def update_credit_card(card_id):
    db = next(get_db())
    user_id = str(get_jwt_identity())
    card = db.query(CreditCard).filter(CreditCard.id == card_id, CreditCard.owner_id == user_id).first()
    if not card:
        return jsonify({"detail": "Credit card not found or not authorized"}), 404

    update_data = request.json
    card.name = update_data.get("name", card.name)
    card.limit = update_data.get("limit", card.limit)
    card.current_bill = update_data.get("current_bill", card.current_bill)
    db.commit()
    db.refresh(card)

    return jsonify({
        "message": "Credit card updated successfully",
        "card": {
            "id": card.id,
            "name": card.name,
            "limit": card.limit,
            "current_bill": card.current_bill,
            "owner_id": card.owner_id,
        },
    }), 200

@app.route("/credit_cards/<int:card_id>", methods=["DELETE"])
@jwt_required()
def delete_credit_card(card_id):
    db = next(get_db())
    user_id = str(get_jwt_identity())
    card = db.query(CreditCard).filter(CreditCard.id == card_id, CreditCard.owner_id == user_id).first()
    if not card:
        return jsonify({"detail": "Credit card not found or not authorized"}), 404

    db.delete(card)
    db.commit()

    return jsonify({"message": "Credit card deleted successfully"}), 204

# Rotas para Transações
@app.route("/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    db = next(get_db())
    user_id = str(get_jwt_identity())
    transaction_data = request.json

    new_transaction = Transaction(
        description=transaction_data.get("description"),
        amount=transaction_data.get("amount"),
        type=transaction_data.get("type"),
        date=date.fromisoformat(transaction_data.get("date")),
        category=transaction_data.get("category"),
        owner_id=user_id,
        account_id=transaction_data.get("account_id"),
        credit_card_id=transaction_data.get("credit_card_id"),
    )
    db.add(new_transaction)

    # Atualizar saldo da conta ou fatura do cartão
    if new_transaction.account_id:
        account = db.query(BankAccount).filter(BankAccount.id == new_transaction.account_id).first()
        if account:
            if new_transaction.type == 'income':
                account.balance += new_transaction.amount
            else:
                account.balance -= new_transaction.amount
    elif new_transaction.credit_card_id:
        card = db.query(CreditCard).filter(CreditCard.id == new_transaction.credit_card_id).first()
        if card:
            if new_transaction.type == 'expense':
                card.current_bill += new_transaction.amount
            else: # income on a credit card is a refund
                card.current_bill -= new_transaction.amount

    db.commit()
    db.refresh(new_transaction)

    return jsonify({
        "message": "Transaction created successfully",
        "transaction": {
            "id": new_transaction.id,
            "description": new_transaction.description,
            "amount": new_transaction.amount,
            "type": new_transaction.type,
            "date": new_transaction.date.isoformat(),
            "category": new_transaction.category,
            "owner_id": new_transaction.owner_id,
            "account_id": new_transaction.account_id,
            "credit_card_id": new_transaction.credit_card_id,
        },
    }), 201

@app.route("/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    db = next(get_db())
    user_id = str(get_jwt_identity())

    transactions = db.query(Transaction).filter(Transaction.owner_id == user_id).all()
    return jsonify([
        {
            "id": transaction.id,
            "description": transaction.description,
            "amount": transaction.amount,
            "type": transaction.type,
            "date": transaction.date.isoformat(),
            "category": transaction.category,
            "owner_id": transaction.owner_id,
            "account_id": transaction.account_id,
            "credit_card_id": transaction.credit_card_id,
        }
        for transaction in transactions
    ]), 200

@app.route("/transactions/<int:transaction_id>", methods=["PUT"])
@jwt_required()
def update_transaction(transaction_id):
    db = next(get_db())
    user_id = str(get_jwt_identity())
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.owner_id == user_id).first()
    if not transaction:
        return jsonify({"detail": "Transaction not found or not authorized"}), 404

    # Reverter o valor antigo
    if transaction.account_id:
        account = db.query(BankAccount).filter(BankAccount.id == transaction.account_id).first()
        if account:
            if transaction.type == 'income':
                account.balance -= transaction.amount
            else:
                account.balance += transaction.amount
    elif transaction.credit_card_id:
        card = db.query(CreditCard).filter(CreditCard.id == transaction.credit_card_id).first()
        if card:
            if transaction.type == 'expense':
                card.current_bill -= transaction.amount
            else:
                card.current_bill += transaction.amount

    update_data = request.json
    transaction.description = update_data.get("description", transaction.description)
    transaction.amount = update_data.get("amount", transaction.amount)
    transaction.type = update_data.get("type", transaction.type)
    transaction.date = date.fromisoformat(update_data.get("date")) if update_data.get("date") else transaction.date
    transaction.category = update_data.get("category", transaction.category)
    transaction.account_id = update_data.get("account_id", transaction.account_id)
    transaction.credit_card_id = update_data.get("credit_card_id", transaction.credit_card_id)

    # Aplicar o novo valor
    if transaction.account_id:
        account = db.query(BankAccount).filter(BankAccount.id == transaction.account_id).first()
        if account:
            if transaction.type == 'income':
                account.balance += transaction.amount
            else:
                account.balance -= transaction.amount
    elif transaction.credit_card_id:
        card = db.query(CreditCard).filter(CreditCard.id == transaction.credit_card_id).first()
        if card:
            if transaction.type == 'expense':
                card.current_bill += transaction.amount
            else:
                card.current_bill -= transaction.amount

    db.commit()
    db.refresh(transaction)

    return jsonify({
        "message": "Transaction updated successfully",
        "transaction": {
            "id": transaction.id,
            "description": transaction.description,
            "amount": transaction.amount,
            "type": transaction.type,
            "date": transaction.date.isoformat(),
            "category": transaction.category,
            "owner_id": transaction.owner_id,
            "account_id": transaction.account_id,
            "credit_card_id": transaction.credit_card_id,
        },
    }), 200

@app.route("/transactions/<int:transaction_id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(transaction_id):
    db = next(get_db())
    user_id = str(get_jwt_identity())
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.owner_id == user_id).first()
    if not transaction:
        return jsonify({"detail": "Transaction not found or not authorized"}), 404

    # Reverter o valor
    if transaction.account_id:
        account = db.query(BankAccount).filter(BankAccount.id == transaction.account_id).first()
        if account:
            if transaction.type == 'income':
                account.balance -= transaction.amount
            else:
                account.balance += transaction.amount
    elif transaction.credit_card_id:
        card = db.query(CreditCard).filter(CreditCard.id == transaction.credit_card_id).first()
        if card:
            if transaction.type == 'expense':
                card.current_bill -= transaction.amount
            else:
                card.current_bill += transaction.amount

    db.delete(transaction)
    db.commit()

    return jsonify({"message": "Transaction deleted successfully"}), 204

@app.route("/monthly_summary", methods=["GET"])
@jwt_required()
def get_monthly_summary():
    db = next(get_db())
    user_id = str(get_jwt_identity())

    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)

    if not month or not year:
        return jsonify({"detail": "Month and year are required"}), 400

    transactions = db.query(Transaction).filter(
        Transaction.owner_id == user_id,
        extract("month", Transaction.date) == month,
        extract("year", Transaction.date) == year,
    ).all()

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = total_income - total_expense

    return jsonify({
        "month": month,
        "year": year,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
    }), 200

if __name__ == "__main__":
    app.run(debug=True, port=8000)
