from fastapi import APIRouter

from src.rag.routes import rag_router

api_router = APIRouter()


api_router.include_router(rag_router, prefix="/rag")
