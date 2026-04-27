from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel

BASE_DIR = Path(__file__).parent.parent


class DbSettings(BaseSettings):
    database_url: str
    cloudinary_url: str
    echo: bool = True

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


class AuthJWT(BaseModel):
    private_key_path: Path = BASE_DIR / "certs" / "jwt-private.pem"
    public_key_path: Path = BASE_DIR / "certs" / "jwt-public.pem"
    algorithm: str = "RS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30


# openssl genrsa -out jwt-private.pem 2048
# openssl rsa -in jwt-private.pem -outform PEM -pubout -out jwt-public.pem


class Settings(BaseSettings):

    db: DbSettings = DbSettings()

    auth_jwt: AuthJWT = AuthJWT()


settings = Settings()
