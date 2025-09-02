from fastapi import Depends
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_users.db import SQLAlchemyUserDatabase 
from typing import TYPE_CHECKING


from app.models.db_helper import db_helper  

from app.models.user import User
    


async def get_user_db(session: Annotated[AsyncSession, Depends(db_helper.session_dependancy)]) -> SQLAlchemyUserDatabase:
    return SQLAlchemyUserDatabase(session, User)