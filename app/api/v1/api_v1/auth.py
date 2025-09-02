from fastapi import APIRouter

from .fastapi_users import fastapi_users
from app.api.v1.dependancy.backend import auth_backend
from app.shemas.user import UserRead, UserCreate

router =  APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

# /loggin
# /logout
router.include_router(
    fastapi_users.get_auth_router(auth_backend,
                                  # requires_verification=True,
                                  ),
    )

# /register
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)

# /verify
router.include_router(
    fastapi_users.get_verify_router(UserRead),

) 

router.include_router(
    fastapi_users.get_reset_password_router()
)