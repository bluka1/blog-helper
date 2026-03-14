from pydantic import BaseModel

class AISuggestTitleRequest(BaseModel):
  content: str
