from fastapi import APIRouter
from .api_v1 import router as all_router

router = APIRouter()

router.include_router(all_router)
