from fastapi import FastAPI
from routers import student, instructor, faculty

app = FastAPI()

app.include_router(student.router)
app.include_router(instructor.router)
app.include_router(faculty.router)