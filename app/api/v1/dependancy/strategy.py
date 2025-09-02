from fastapi_users.authentication import JWTStrategy

from app.config import settings

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        lifetime_seconds=settings.auth.authjwt_token_expiry,
        algorithm=settings.auth.authjwt_algorithm,
        secret=settings.auth.authjwt_private_key,     # публічний ключ для перевірки
    )