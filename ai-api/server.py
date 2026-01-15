from fastapi import FastAPI
import aiohttp
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from schemas.AICompleteRequest import AICompleteRequest

app = FastAPI()
app.title = "AI completion API"
app.version = "1.0.0"
app.description = "An API for AI completions using Hugging Face models."
app.port = 8003

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)



@app.post("/ai-complete")
async def ai_complete(request: AICompleteRequest):
  async with aiohttp.ClientSession() as session:
    res = await session.post('http://localhost:11434/api/chat', json={
      "model": "gemma3",
      "messages": [
        {
          "role": "user",
          "content": request.prompt,
        },
      ],
      "stream": False
    }, headers={
      "Content-Type": "application/json",
    })
    data = await res.json()
    return data["message"]["content"]


if __name__ == "__main__":
  uvicorn.run(app, host="localhost", port=app.port)
