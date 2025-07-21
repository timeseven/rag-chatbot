from abc import ABC, abstractmethod

from fastapi import UploadFile
from langchain_core.runnables import Runnable


class IRagService(ABC):
    @abstractmethod
    async def upload_file(self, tenant_id: str, file: UploadFile):
        pass

    @abstractmethod
    def get_qa_chain(self, tenant_id: str) -> Runnable:
        pass
