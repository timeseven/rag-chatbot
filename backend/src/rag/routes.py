from typing import Annotated

from fastapi import APIRouter, Header, Request, UploadFile

from src.core.rate_limit import limiter
from src.rag.deps import RagServiceDep
from src.rag.schemas import ChatRequest, ChatResponse

rag_router = APIRouter()


@rag_router.post("/upload")
@limiter.limit("3/day")
async def upload_file(
    request: Request,
    rag_service: RagServiceDep,
    tenant_id: Annotated[str, Header(alias="X-Tenant-ID")],
    file: UploadFile,
):
    await rag_service.upload_file(tenant_id, file)
    return {"message": "File uploaded successfully."}


@rag_router.post("/ask", response_model=ChatResponse)
@limiter.limit("4/day")
async def ask_question(
    request: Request,
    rag_service: RagServiceDep,
    tenant_id: Annotated[str, Header(alias="X-Tenant-ID")],
    req: ChatRequest,
):
    chain = rag_service.get_qa_chain(tenant_id)
    response = await chain.ainvoke({"input": req.question})
    return ChatResponse(answer=response["answer"])
