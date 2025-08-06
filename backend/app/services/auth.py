from sqlalchemy.orm import Session
from passlib.context import CryptContext
from flask_jwt_extended import create_access_token
from app.models import User
from app.schemas import UserCreate, UserLogin
from app.utils.exceptions import ConflictError, UnauthorizedError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ConflictError("Email already registered")
        
        hashed_password = AuthService.hash_password(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    
    @staticmethod
    def authenticate_user(db: Session, login_data: UserLogin) -> str:
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user or not AuthService.verify_password(login_data.password, user.hashed_password):
            raise UnauthorizedError("Invalid credentials")
        
        access_token = create_access_token(identity=user.id)
        return access_token
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UnauthorizedError("User not found")
        return user