import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

load_dotenv()

connect_args = {"check_same_thread": False}
database_url = os.getenv("MYSQL_DATABASE_URL")
engine = create_async_engine(
    database_url,
    echo=False,
)

SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_session():
   async with SessionLocal() as session:
        yield session