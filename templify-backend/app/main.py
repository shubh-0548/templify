# from fastapi import FastAPI
# from app.core.config import settings
# from app.database.connection import engine, Base
# from app.reports.routes import router as reports_router
# from fastapi.middleware.cors import CORSMiddleware
#
# # Create tables
# Base.metadata.create_all(bind=engine)
#
# app = FastAPI(
#     title=settings.PROJECT_NAME,
#     version=settings.VERSION
# )
#
# # Allow local frontend (adjust origins in prod)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
# @app.get("/")
# def root():
#     return {"message": "Templify API is running"}
#
# app.include_router(reports_router)
from fastapi import FastAPI
from app.core.config import settings
from app.database.connection import engine, Base
from app.reports.routes import router as reports_router
from fastapi.middleware.cors import CORSMiddleware

# Create tables (useful for dev). In prod prefer Alembic migrations.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# Allow local frontend (adjust to prod origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Templify API is running"}

app.include_router(reports_router)
