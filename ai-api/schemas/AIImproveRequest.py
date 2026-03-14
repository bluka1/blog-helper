from pydantic import BaseModel
from typing import Optional

class AIImproveRequest(BaseModel):
  content: str
  style: Optional[str] = None  # "formalan" | "neformalan" | "tehnicki"
