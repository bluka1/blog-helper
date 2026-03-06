import datetime
import fcntl
import os
from sqlmodel import Session, Field, SQLModel, create_engine
from faker import Faker

faker = Faker()

class User(SQLModel, table=True):  
  __tablename__ = "users"
  id: int | None = Field(default=None, primary_key=True)
  username: str = Field(unique=True, nullable=False)
  email: str = Field(unique=True, nullable=False)
  auth0_id: str = Field(unique=True, nullable=False)
  created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

class Post(SQLModel, table=True):
  __tablename__ = "posts"
  id: int | None = Field(default=None, primary_key=True)
  title: str = Field(nullable=False)
  content: str = Field(nullable=False)
  user_id: int = Field(foreign_key="users.id")
  created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
  updated_at: datetime.datetime | None = Field(default=None)

class PostCreate(SQLModel):
  title: str
  content: str

class PostUpdate(SQLModel):
  title: str
  content: str

class PostResponse(SQLModel):
  id: int
  title: str
  content: str
  user_id: int
  author_name: str
  author_auth0_id: str
  created_at: datetime.datetime
  updated_at: datetime.datetime | None

os.makedirs("/app/data", exist_ok=True) # create data directory if it doesn't exist
sqlite_file_name = "/app/data/database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False, "timeout": 30})

def create_db_and_tables():
  SQLModel.metadata.create_all(engine)
  with Session(engine) as session:
    user_count = session.query(User).count()
    if user_count == 0:
      for i in range(1, 11):
        user = User(username=faker.user_name(), email=faker.email(), auth0_id=faker.uuid4(), created_at=faker.date_time_this_decade())
        session.add(user)
        session.commit()
        session.refresh(user)
      for i in range(1, 100):
        post = Post(title=faker.sentence(nb_words=5), content=faker.paragraph(nb_sentences=20), user_id=((i-1) % 9) + 1, created_at=faker.date_time_this_year(), updated_at=None)
        session.add(post)
        session.commit()
        session.refresh(post)
