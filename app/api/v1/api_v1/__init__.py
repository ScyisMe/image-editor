from fastapi import APIRouter
from fastapi import Depends
from fastapi.security import HTTPBearer

from app.config import settings
from .auth import router as auth_router
from .users import router as user_router
from app.api.v1.api_v1.convertimage.view import router as picture_router

http_bearer = HTTPBearer(auto_error=False)

router = APIRouter(
    prefix="/api_v1",
    dependencies=[Depends(http_bearer)]
    )

router.include_router(
    auth_router,
)

router.include_router(
    user_router,
)
router.include_router(
    picture_router,
)