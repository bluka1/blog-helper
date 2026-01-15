from pydantic import BaseModel

class AICompleteRequest(BaseModel):
  prompt: str
