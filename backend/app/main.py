from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers.auth import router as auth_router, users_router
from app.routers.courses import router as courses_router
from app.routers.progress import router as progress_router
from app.routers.webhooks import router as webhooks_router

app = FastAPI(title="DeepLearn API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(courses_router)
app.include_router(progress_router)
app.include_router(webhooks_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
