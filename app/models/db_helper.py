from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings


class DataBase:
    def __init__(self, url, echo = False):
        self.engine = create_async_engine(
            url=str(url),
            echo=echo,
            future=True,
        )
        
        self.async_session_factory = async_sessionmaker(
            bind=self.engine,
            expire_on_commit=False,
        )

    async def session_dependancy(self) -> "AsyncGenerator[AsyncSession, None]":
        async with self.async_session_factory() as session:
            yield session

    async def dispose(self):
        await self.engine.dispose() 


db_helper = DataBase(settings.db.database_url, echo=settings.db.database_echo)