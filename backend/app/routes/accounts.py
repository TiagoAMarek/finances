from flask import Blueprint, request, jsonify
from app.schemas import (
    BankAccountCreate, BankAccountUpdate, BankAccountResponse,
    CreditCardCreate, CreditCardUpdate, CreditCardResponse
)
from app.services import AccountService
from app.utils.decorators import require_auth

accounts_bp = Blueprint('accounts', __name__)


@accounts_bp.route("/accounts", methods=["POST"])
@require_auth
def create_bank_account(db, user_id):
    account_data = BankAccountCreate(**request.json)
    account = AccountService.create_bank_account(db, user_id, account_data)
    return jsonify({
        "message": "Account created successfully",
        "account": BankAccountResponse.from_orm(account).dict()
    }), 201


@accounts_bp.route("/accounts", methods=["GET"])
@require_auth
def get_bank_accounts(db, user_id):
    accounts = AccountService.get_user_bank_accounts(db, user_id)
    return jsonify([
        BankAccountResponse.from_orm(account).dict() 
        for account in accounts
    ]), 200


@accounts_bp.route("/accounts/<int:account_id>", methods=["PUT"])
@require_auth
def update_bank_account(db, user_id, account_id):
    update_data = BankAccountUpdate(**request.json)
    account = AccountService.update_bank_account(db, user_id, account_id, update_data)
    return jsonify({
        "message": "Account updated successfully",
        "account": BankAccountResponse.from_orm(account).dict()
    }), 200


@accounts_bp.route("/accounts/<int:account_id>", methods=["DELETE"])
@require_auth
def delete_bank_account(db, user_id, account_id):
    AccountService.delete_bank_account(db, user_id, account_id)
    return jsonify({"message": "Account deleted successfully"}), 204


@accounts_bp.route("/credit_cards", methods=["POST"])
@require_auth
def create_credit_card(db, user_id):
    card_data = CreditCardCreate(**request.json)
    card = AccountService.create_credit_card(db, user_id, card_data)
    return jsonify({
        "message": "Credit card created successfully",
        "card": CreditCardResponse.from_orm(card).dict()
    }), 201


@accounts_bp.route("/credit_cards", methods=["GET"])
@require_auth
def get_credit_cards(db, user_id):
    cards = AccountService.get_user_credit_cards(db, user_id)
    return jsonify([
        CreditCardResponse.from_orm(card).dict() 
        for card in cards
    ]), 200


@accounts_bp.route("/credit_cards/<int:card_id>", methods=["PUT"])
@require_auth
def update_credit_card(db, user_id, card_id):
    update_data = CreditCardUpdate(**request.json)
    card = AccountService.update_credit_card(db, user_id, card_id, update_data)
    return jsonify({
        "message": "Credit card updated successfully",
        "card": CreditCardResponse.from_orm(card).dict()
    }), 200


@accounts_bp.route("/credit_cards/<int:card_id>", methods=["DELETE"])
@require_auth
def delete_credit_card(db, user_id, card_id):
    AccountService.delete_credit_card(db, user_id, card_id)
    return jsonify({"message": "Credit card deleted successfully"}), 204