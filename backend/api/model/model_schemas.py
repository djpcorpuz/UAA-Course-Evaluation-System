from sqlmodel import SQLModel, Field

# All the classes represents the table in the database

class StudentsEnrolled(SQLModel, table=True):
    email_address: str = Field(primary_key=True, index=True)
    crn: int
    term: int
    took_survey: bool

class CourseAnswers(SQLModel):
    answer_id: int = Field(primary_key=True, index=True)
    crn: int
    term: int
    question_id: int
    value: dict

class Courses(SQLModel):
    crn: int = Field(primary_key=True, index=True)
    term: int = Field(primary_key=True, index=True)
    campus: str
    subject: str
    course_number: str
    section: int
    title: str
    delivery_methods: list[int]
    survey_set_id: int
    edit_lock_by: str
    survey_start: str
    survey_end: str

class InstructorsOfCourses(SQLModel):
    email_address: str = Field(primary_key=True, index=True)
    crn: int = Field(primary_key=True, index=True)
    term: int = Field(primary_key=True, index=True)

class Instructors(SQLModel):
    email_address: str = Field(primary_key=True, index=True)
    first_name: str 
    last_name: str

class DeliveryMethods(SQLModel):
    delivery_method_id: int = Field(primary_key=True, index=True)
    name: str

class SurveySets(SQLModel):
    set_id: int = Field(primary_key=True, index=True)
    name: str
    description: str
    question_ids: list[int]

class SurveyQuestions(SQLModel):
    question_id: int = Field(primary_key=True, index=True)
    question: str
    question_id: int

class QuestionTypes(SQLModel):
    option_id: int = Field(primary_key=True, index=True)
    value: dict

