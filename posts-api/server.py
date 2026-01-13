from fastapi import FastAPI
from sqlmodel import Session, select
from db import create_db_and_tables, Post, engine

app = FastAPI()
app.title = "Posts API"
app.version = "1.0.0"
app.description = "An API for managing blog posts."

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

@app.get('/posts')
def get_posts():
  with Session(engine) as session:
    statement = select(Post)
    results = session.exec(statement)
    for post in results:
      print(post)
    return results.all()

@app.post('/posts')
def create_post(post: Post):
  with Session(engine) as session:
    session.add(post)
    session.commit()
    session.refresh(post)
    return post
