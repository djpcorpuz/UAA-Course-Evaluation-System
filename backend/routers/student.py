from fastapi import APIRouter

router = APIRouter(
    prefix="/student",
    responses={404: {"description": "Not found"}}, # Default error message
)

@router.get("/courses")
async def get_available_courses():
    return [{"class": "class1"}, {"class": "class2"}, {"class": "class3"}]
