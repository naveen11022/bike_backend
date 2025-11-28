from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Bike Car Marketplace API"

    DATABASE_URL: str = "postgresql://neondb_owner:npg_aOwq5dFolPx2@ep-small-cell-adgf40ty-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
    JWT_SECRET: str = "supersecret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24


settings = Settings()
