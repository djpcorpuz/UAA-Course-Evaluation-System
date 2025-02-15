from django.urls import path
from .views import get_enrolled_courses

urlpatterns = [
    path('student/courses', get_enrolled_courses, name='get_user')
]