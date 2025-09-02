from fastapi import Depends
from .user import get_user_db

from app.core.auth.user_manager import UserManager

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
    