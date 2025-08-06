from flask import Blueprint, request, jsonify
from app.schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from app.services import TransactionService
from app.utils.decorators import require_auth

transactions_bp = Blueprint('transactions', __name__)


@transactions_bp.route("/transactions", methods=["POST"])
@require_auth
def create_transaction(db, user_id):
    transaction_data = TransactionCreate(**request.json)
    transaction = TransactionService.create_transaction(db, user_id, transaction_data)
    return jsonify({
        "message": "Transaction created successfully",
        "transaction": TransactionResponse.from_orm(transaction).dict()
    }), 201


@transactions_bp.route("/transactions", methods=["GET"])
@require_auth
def get_transactions(db, user_id):
    transactions = TransactionService.get_user_transactions(db, user_id)
    return jsonify([
        TransactionResponse.from_orm(transaction).dict() 
        for transaction in transactions
    ]), 200


@transactions_bp.route("/transactions/<int:transaction_id>", methods=["PUT"])
@require_auth
def update_transaction(db, user_id, transaction_id):
    update_data = TransactionUpdate(**request.json)
    transaction = TransactionService.update_transaction(db, user_id, transaction_id, update_data)
    return jsonify({
        "message": "Transaction updated successfully",
        "transaction": TransactionResponse.from_orm(transaction).dict()
    }), 200


@transactions_bp.route("/transactions/<int:transaction_id>", methods=["DELETE"])
@require_auth
def delete_transaction(db, user_id, transaction_id):
    TransactionService.delete_transaction(db, user_id, transaction_id)
    return jsonify({"message": "Transaction deleted successfully"}), 204


@transactions_bp.route("/monthly_summary", methods=["GET"])
@require_auth
def get_monthly_summary(db, user_id):
    month = request.args.get("month", type=int)
    year = request.args.get("year", type=int)
    
    if not month or not year:
        return jsonify({"detail": "Month and year are required"}), 400
    
    summary = TransactionService.get_monthly_summary(db, user_id, month, year)
    return jsonify(summary.dict()), 200