import uvicorn
import logging

from app.config import settings
from app.api.v1 import router as api_router
from create_main_app import create_app
import app.middlewaries.cors  # ensure CORS middleware is registered

logging.basicConfig(
    level=logging.INFO,
)


main_app = create_app(True)
main_app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(
        "main:main_app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True,
        )