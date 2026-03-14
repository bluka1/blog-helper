from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import aiohttp
import json
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware
from schemas.AICompleteRequest import AICompleteRequest
from schemas.AIImproveRequest import AIImproveRequest
from schemas.AISuggestTitleRequest import AISuggestTitleRequest

app = FastAPI()
app.title = "AI completion API"
app.version = "1.0.0"
app.description = "An API for AI completions using Ollama."
app.port = 8003

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

OLLAMA_URL = os.getenv("OLLAMA_URL")

async def ollama_chat(prompt: str) -> str:
  async with aiohttp.ClientSession() as session:
    res = await session.post(f'{OLLAMA_URL}/api/chat', json={
      "model": "gemma3",
      "messages": [{"role": "user", "content": prompt}],
      "stream": False,
    }, headers={"Content-Type": "application/json"})
    data = await res.json()
    return data["message"]["content"]


@app.post("/ai-complete")
async def ai_complete(request: AICompleteRequest):
  return await ollama_chat(request.prompt)


@app.post("/ai-complete/stream")
async def ai_complete_stream(request: AICompleteRequest):
  async def event_generator():
    async with aiohttp.ClientSession() as session:
      async with session.post(f'{OLLAMA_URL}/api/chat', json={
        "model": "gemma3",
        "messages": [{"role": "user", "content": request.prompt}],
        "stream": True,
      }, headers={"Content-Type": "application/json"}) as res:
        async for line in res.content:
          text = line.decode("utf-8").strip()
          if not text:
            continue
          try:
            chunk = json.loads(text)
            token = chunk.get("message", {}).get("content", "")
            if token:
              yield f"data: {json.dumps(token)}\n\n"
            if chunk.get("done"):
              yield "data: [DONE]\n\n"
              break
          except json.JSONDecodeError:
            continue

  return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/ai-improve")
async def ai_improve(request: AIImproveRequest):
  style_instruction = ""
  if request.style == "formal":
    style_instruction = " Use a formal, professional tone."
  elif request.style == "casual":
    style_instruction = " Use a casual, conversational tone."
  elif request.style == "technical":
    style_instruction = " Use a technical, precise tone with domain-specific terminology."

  prompt = (
    f"Improve the following blog post content. Make it more engaging, clear, and well-structured.{style_instruction} "
    f"Return only the improved text, no explanations.\n\n{request.content}"
  )
  return await ollama_chat(prompt)


@app.post("/ai-suggest-title")
async def ai_suggest_title(request: AISuggestTitleRequest):
  prompt = (
    f"Based on the following blog post content, suggest exactly 3 compelling titles. "
    f"Return them as a JSON array of strings, nothing else. Example: [\"Title 1\", \"Title 2\", \"Title 3\"]\n\n"
    f"{request.content[:500]}"
  )
  raw = await ollama_chat(prompt)
  try:
    start = raw.index("[")
    end = raw.rindex("]") + 1
    titles = json.loads(raw[start:end])
    return titles[:3]
  except (ValueError, json.JSONDecodeError):
    lines = [l.strip().lstrip("0123456789.-) ") for l in raw.strip().splitlines() if l.strip()]
    return lines[:3]


if __name__ == "__main__":
  uvicorn.run(app, host="localhost", port=app.port)
