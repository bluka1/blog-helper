from pydantic import BaseModel

class TokenVerifyRequest(BaseModel):
  token: str
