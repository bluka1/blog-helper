import aiohttp
import os
from fastapi import Header, HTTPException
from sqlmodel import Session, select
from db import User, engine
from pydantic import BaseModel

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")

class CurrentUser(BaseModel):
	id: int
	auth0_id: str
	email: str
	username: str

async def get_current_user(authorization: str = Header(...)) -> CurrentUser:
	if not authorization.startswith("Bearer "):
		raise HTTPException(status_code=401, detail="Invalid authorization header")

	token = authorization[len("Bearer "):]

	async with aiohttp.ClientSession() as session:
		try:
			async with session.post(
				f"{AUTH_SERVICE_URL}/auth/verify-token",
				json={"token": token}
			) as response:
				data = await response.json()
		except aiohttp.ClientError:
			raise HTTPException(status_code=503, detail="Auth service unavailable")

	if not data.get("valid"):
		raise HTTPException(status_code=401, detail=data.get("error", "Invalid token"))

	auth0_id = data["auth0_id"]
	email = data["email"]
	name = data.get("name")

	with Session(engine) as db_session:
		user = db_session.exec(select(User).where(User.auth0_id == auth0_id)).one_or_none()

		if not user:
			username = (name or email.split("@")[0]).replace(" ", "_").lower()
			user = User(username=username, email=email, auth0_id=auth0_id)
			db_session.add(user)
			db_session.commit()
			db_session.refresh(user)

		return CurrentUser(id=user.id, auth0_id=user.auth0_id, email=user.email, username=user.username)
