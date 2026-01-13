import aiohttp
import os
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.title = 'Auth Service'
app.version = '1.0.0'
app.description = 'A simple authentication service to obtain access tokens.'

CLIENT_ID = os.environ['AUTH0_CLIENT_ID']
CLIENT_SECRET = os.environ['AUTH0_CLIENT_SECRET']
API_URL = os.environ['AUTH0_API_URL']
AUDIENCE = os.environ['AUTH0_AUDIENCE']

@app.post('/')
async def get_token():
  async with aiohttp.ClientSession() as session:
    res = await session.post(API_URL, json={
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'audience': AUDIENCE,
      'grant_type': 'client_credentials'
    }, headers={
      'content-type': 'application/json'
    })
    data = await res.json()
    return data

@app.post('/verify-token')
async def verify_token(token: str):
  async with aiohttp.ClientSession() as session:
    res = await session.get(f'{AUDIENCE}userinfo', headers={
      'authorization': f'Bearer {token}'
    })
    data = await res.json()
    return data
