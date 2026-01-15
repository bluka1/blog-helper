from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from datetime import datetime, timedelta
from jose import jwt, JWTError
import aiohttp
import os
from dotenv import load_dotenv
import uvicorn
from schemas.TokenVerifyRequest import TokenVerifyRequest

load_dotenv()

app = FastAPI()
app.title = "Auth Service"
app.version = "1.0.0"
app.description = "Authentication Service using Auth0 and JWT"
app.port = 8001

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# konfiguracija za Auth0
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET")

AUTH0_CALLBACK_URL = os.getenv("AUTH0_CALLBACK_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

def create_jwt(auth0_id: str, email: str, name: str = None) -> str:
  payload = {
    "auth0_id": auth0_id,
    "email": email,
    "name": name,
    "exp": datetime.utcnow() + timedelta(days=7),
    "iat": datetime.utcnow()
  }
  return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt(token: str) -> dict:
  try:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
  except JWTError:
    return None

@app.get("/auth/login")
def login():
  url = (f"https://{AUTH0_DOMAIN}/authorize?client_id={AUTH0_CLIENT_ID}&response_type=code&redirect_uri={AUTH0_CALLBACK_URL}&scope=openid profile email")
  return RedirectResponse(url)

@app.get("/auth/callback")
async def callback(code: str):
  async with aiohttp.ClientSession() as session:
    # zamijena koda za token
    async with session.post(
      f"https://{AUTH0_DOMAIN}/oauth/token",
      json={
        "grant_type": "authorization_code",
        "client_id": AUTH0_CLIENT_ID,
        "client_secret": AUTH0_CLIENT_SECRET,
        "code": code,
        "redirect_uri": AUTH0_CALLBACK_URL
      }
    ) as response:
      tokens = await response.json()
      access_token = tokens.get("access_token")
  
  async with aiohttp.ClientSession() as session:
    # dohvat korisnikovih informacija
    async with session.get(
      f"https://{AUTH0_DOMAIN}/userinfo",
      headers={"Authorization": f"Bearer {access_token}"}
    ) as response:
      user_info = await response.json()
  
  auth0_id = user_info.get("sub")
  email = user_info.get("email")
  name = user_info.get("name")
  
  # generiranje jwt tokena
  jwt_token = create_jwt(auth0_id, email, name)
  
  # redirect na frontend s tokenom
  return RedirectResponse(url=f"{FRONTEND_URL}?token={jwt_token}")


@app.post("/auth/verify-token")
def verify_token(request: TokenVerifyRequest):
  token = request.token.replace("Bearer ", "")
  payload = verify_jwt(token)
  
  if not payload:
    return {"valid": False, "error": "Invalid token"}
  
  return {
    "valid": True,
    "auth0_id": payload.get("auth0_id"),
    "email": payload.get("email"),
    "name": payload.get("name")
  }

# pokretanje servera na portu 8001
if __name__ == "__main__":
  print("Auth Service: http://localhost:8001")
  uvicorn.run(app, host="localhost", port=app.port)
