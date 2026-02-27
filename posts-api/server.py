from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from db import create_db_and_tables, Post, engine, PostCreate
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

@app.get('/posts')
def get_posts(current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    statement = select(Post)
    results = session.exec(statement)
    return results.all()

@app.get('/posts/{post_id}')
def get_post(post_id: int, current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    statement = select(Post).where(Post.id == post_id)
    result = session.exec(statement)
    post_to_get = result.one_or_none()
    if post_to_get:
      return post_to_get
    else:
      raise HTTPException(status_code=404, detail="Post not found")

@app.post('/posts')
def create_post(post: PostCreate, current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    db_post = Post(title=post.title, content=post.content, user_id=current_user.id)
    session.add(db_post)
    session.commit()
    session.refresh(db_post)
    return db_post

@app.put('/posts/{post_id}')
def update_post(post_id: int, post: Post, current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    statement = select(Post).where(Post.id == post_id)
    result = session.exec(statement)
    post_to_update = result.one_or_none()
    if not post_to_update:
      raise HTTPException(status_code=404, detail="Post not found")
    if post_to_update.user_id != current_user.id:
      raise HTTPException(status_code=403, detail="Forbidden")
    post_to_update.title = post.title
    post_to_update.content = post.content
    post_to_update.updated_at = datetime.datetime.now()
    session.commit()
    session.refresh(post_to_update)
    return post_to_update

@app.delete('/posts/{post_id}')
def delete_post(post_id: int, current_user: CurrentUser = Depends(get_current_user)):
  with Session(engine) as session:
    statement = select(Post).where(Post.id == post_id)
    result = session.exec(statement)
    post_to_delete = result.one_or_none()
    if not post_to_delete:
      raise HTTPException(status_code=404, detail="Post not found")
    if post_to_delete.user_id != current_user.id:
      raise HTTPException(status_code=403, detail="Forbidden")
    session.delete(post_to_delete)
    session.commit()
    return {"message": "Post deleted successfully"}

if __name__ == "__main__":
  uvicorn.run(app, host="localhost", port=app.port)
