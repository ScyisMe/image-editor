from pydantic import BaseModel, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from PIL import Image
from typing import Dict

BASE_DIR = Path(__file__).resolve().parent.parent

class RunSettings(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8000

class ImageSettings(BaseModel):
    allowed_formats: dict[str, str] = {
        "JPG": "JPEG",
        "jpeg": "JPEG",
        "jpg": "JPEG",
        "png": "PNG",
        "webp": "WEBP"
    }
    max_size: int = 5 * 1024 * 1024  # 5 MB
    transform_image: Dict[str, Image.Transpose] = {
        "left": Image.Transpose.FLIP_LEFT_RIGHT,
        "right": Image.Transpose.FLIP_LEFT_RIGHT,
        "top": Image.Transpose.FLIP_TOP_BOTTOM,
        "bottom": Image.Transpose.FLIP_TOP_BOTTOM,
        "rotate_90": Image.Transpose.ROTATE_90,
        "rotate_180": Image.Transpose.ROTATE_180,
        "rotate_270": Image.Transpose.ROTATE_270,
    }

class DBSettings(BaseModel):
    database_url: PostgresDsn
    database_echo: bool = False

class APISettings(BaseModel):
    authjwt_public_key: str = str(BASE_DIR / "cert" / "public_key.pem")
    authjwt_private_key: str = str(BASE_DIR / "cert" / "private_key.pem")
    authjwt_token_expiry: int = 3600
    authjwt_algorithm: str = "HS256"
    authjwt_token_location: str = "headers"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
    )
    
    db: DBSettings  # обов'язкове поле для налаштувань бази даних
    auth: APISettings = APISettings()  # Налаштування для API
    run: RunSettings = RunSettings()  # Налаштування для запуску
    image: ImageSettings = ImageSettings()  # Налаштування для обробки зображень

settings = Settings()