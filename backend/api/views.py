from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import StudentsEnrolledSerializer
from rest_framework.permissions import IsAuthenticated
from .models import StudentsEnrolled


# Create your views here.

class EnrolledCoursesView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        user_email_address = "aaron75@alaska.edu" # Temp value until Google Auth implemented
        all_student_courses = StudentsEnrolled.objects.filter(email_address=user_email_address)
        serialized_courses = StudentsEnrolledSerializer(all_student_courses, many=True)
        return Response(serialized_courses.data)