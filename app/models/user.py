from sqlalchemy.orm import Mapped, mapped_column    
from fastapi_users.db import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase

from app.api.v1.mixin.user_id import IdIntPrimMixin
from .base import Base

class User(Base, IdIntPrimMixin, SQLAlchemyBaseUserTable[int]):   
    @classmethod
    def get_db(cls, session):
        return SQLAlchemyUserDatabase(session, User)