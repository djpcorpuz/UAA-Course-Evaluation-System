from django.urls import path
from .views import EnrolledCoursesView, CourseAnswersView

urlpatterns = [
    path('courses', EnrolledCoursesView.as_view(), name='get_enrolled_courses'),
    path('course-answers', CourseAnswersView.as_view(), name="get_courses_answers")
]