from fastapi import APIRouter

router = APIRouter(
    prefix="/faculty",
    responses={404: {"description": "Not found"}}, # Default error message
)