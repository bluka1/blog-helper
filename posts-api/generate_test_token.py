import base64
import hashlib
import hmac
import json
import os
import time


def base64url_encode(data: bytes) -> str:
  return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def create_jwt(secret: str, auth0_id: str, email: str, name: str) -> str:
	header = {"alg": "HS256", "typ": "JWT"}
	payload = {
		"auth0_id": auth0_id,
		"email": email,
		"name": name,
		"exp": int(time.time()) + 7 * 24 * 3600,
		"iat": int(time.time()),
	}

	header_b64 = base64url_encode(json.dumps(header, separators=(",", ":")).encode())
	payload_b64 = base64url_encode(json.dumps(payload, separators=(",", ":")).encode())

	message = f"{header_b64}.{payload_b64}"
	signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
	sig_b64 = base64url_encode(signature)

	return f"{message}.{sig_b64}"


JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
	print("ERROR: JWT_SECRET env var nije postavljen.")
	exit(1)

token = create_jwt(
	secret=JWT_SECRET,
	auth0_id="test|local-dev-user",
	email="dev@test.com",
	name="Dev User",
)

# JWT_SECRET=auth0_secret_token python generate_test_token.py

# PRIMJER POST REQUESTA

# curl -X POST http://localhost:8002/posts \
#   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoMF9pZCI6InRlc3R8bG9jYWwtZGV2LXVzZXIiLCJlbWFpbCI6ImRldkB0ZXN0LmNvbSIsIm5hbWUiOiJEZXYgVXNlciIsImV4cCI6MTc3MjgxMDkwMCwiaWF0IjoxNzcyMjA2MTAwfQ.HzH7RUPoVO-GGFH__wneL4EJs_5_tFiXnIHFy2k-AVI" \
#   -H "Content-Type: application/json" \
#   -d '{"title": "Test post", "content": "Sadržaj test posta."}'