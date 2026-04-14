from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "dev-secret-change-in-production"
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/callback"
    POLAR_WEBHOOK_SECRET: str = ""
    FRONTEND_URL: str = "http://localhost:5173"
    DATABASE_PATH: str = "./data/deeplearn.db"

    @property
    def DATABASE_URL(self) -> str:
        return f"sqlite+aiosqlite:///{self.DATABASE_PATH}"

    class Config:
        env_file = ".env"


settings = Settings()
