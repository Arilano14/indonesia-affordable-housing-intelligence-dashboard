from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Indonesia Affordable Housing Intelligence Dashboard API",
    description="Backend API for IAHID using FastAPI and Supabase",
    version="1.0.0"
)

# Allow Next.js frontend to communicate with this API
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "*" # Update in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "IAHID API is running"}

from app.api.etl import router as etl_router

app.include_router(etl_router)
