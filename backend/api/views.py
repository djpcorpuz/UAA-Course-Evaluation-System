from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import StudentsEnrolled
from .serializer import StudentsEnrolledSerializer

# Create your views here.

@api_view(['GET'])
def get_enrolled_courses(request):
    all_student_courses = StudentsEnrolled.objects.all()
    serialized_courses = StudentsEnrolledSerializer(all_student_courses, many=True)
    return Response(serialized_courses.data)
