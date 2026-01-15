from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from db import create_db_and_tables, Post, engine
import uvicorn

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
def get_posts():
  with Session(engine) as session:
    statement = select(Post)
    results = session.exec(statement)
    return results.all()

@app.post('/posts')
def create_post(post: Post):
  with Session(engine) as session:
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=app.port)
