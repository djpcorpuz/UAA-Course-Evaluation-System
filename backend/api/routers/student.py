from fastapi import APIRouter, Depends
from sqlmodel import select
from database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from model.model_schemas import StudentsEnrolled

router = APIRouter(
    prefix="/student",
    responses={404: {"description": "Not found"}}, # Default error message
)

@router.get("/courses")
async def get_available_courses(db: AsyncSession = Depends(get_session)):

    # Sample async request
    result  = await db.execute(select(StudentsEnrolled))
    students = result.scalars().all()
    return students
