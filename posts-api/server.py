from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from db import create_db_and_tables, Post, User, engine, PostCreate, PostUpdate, PostResponse
from middleware.auth import get_current_user, CurrentUser
import uvicorn
import datetime

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
app.title = "Posts API"
app.version = "1.0.0"
app.description = "An API for managing blog posts."
app.port = 8002

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

def build_post_response(post: Post, session: Session) -> PostResponse:
  author = session.get(User, post.user_id)
  author_name = author.username if author else "Unknown"
  author_auth0_id = author.auth0_id if author else ""
  return PostResponse(
    id=post.id,
    title=post.title,
    content=post.content,
    user_id=post.user_id,
    author_name=author_name,
    author_auth0_id=author_auth0_id,
    created_at=post.created_at,
    updated_at=post.updated_at,
  )

@app.get('/posts', response_model=list[PostResponse])
def get_posts(_: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    posts = session.exec(select(Post)).all()
    return [build_post_response(p, session) for p in posts]

@app.get('/posts/{post_id}', response_model=PostResponse)
def get_post(post_id: int, _: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    post = session.get(Post, post_id)
    if not post:
      raise HTTPException(status_code=404, detail="Post not found")
    return build_post_response(post, session)

@app.post('/posts', response_model=PostResponse, status_code=201)
def create_post(post: PostCreate, current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    db_post = Post(title=post.title, content=post.content, user_id=current_user.id)
    session.add(db_post)
    session.commit()
    session.refresh(db_post)
    return build_post_response(db_post, session)

@app.put('/posts/{post_id}', response_model=PostResponse)
def update_post(post_id: int, post: PostUpdate, current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    post_to_update = session.get(Post, post_id)
    if not post_to_update:
      raise HTTPException(status_code=404, detail="Post not found")
    if post_to_update.user_id != current_user.id:
      raise HTTPException(status_code=403, detail="Forbidden")
    post_to_update.title = post.title
    post_to_update.content = post.content
    post_to_update.updated_at = datetime.datetime.now()
    session.commit()
    session.refresh(post_to_update)
    return build_post_response(post_to_update, session)

@app.delete('/posts/{post_id}')
def delete_post(post_id: int, current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    post_to_delete = session.get(Post, post_id)
    if not post_to_delete:
      raise HTTPException(status_code=404, detail="Post not found")
    if post_to_delete.user_id != current_user.id:
      raise HTTPException(status_code=403, detail="Forbidden")
    session.delete(post_to_delete)
    session.commit()
    return {"message": "Post deleted successfully"}

if __name__ == "__main__":
  uvicorn.run(app, host="localhost", port=app.port)
