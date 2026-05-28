import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    database_url: str
    cloudinary_url: str

    secret_key: str
    algorithm: str

    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str

    jwt_private_key: str
    jwt_public_key: str

    mail_username: str
    mail_password: str
    mail_from: str
    environment: str = "local"

    access_token_expire_minutes: int = 120

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")


settings = Settings()
os.environ["CLOUDINARY_URL"] = settings.cloudinary_url
