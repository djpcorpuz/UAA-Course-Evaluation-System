from django.urls import path
from .views import EnrolledCoursesView

urlpatterns = [
    path('student/courses', EnrolledCoursesView.as_view(), name='get_enrolled_courses')
]