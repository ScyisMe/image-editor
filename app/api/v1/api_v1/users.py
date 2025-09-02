from fastapi import APIRouter

from .fastapi_users import fastapi_users
from app.shemas.user import UserRead, UserUpdate


router =  APIRouter(
    prefix="/users",
    tags=["Users"],
)

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
)