from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import StudentsEnrolledSerializer
from rest_framework.permissions import IsAuthenticated
from .models import StudentsEnrolled


# Create your views here.

class EnrolledCoursesView(APIView):
    # permission_classes = [IsAuthenticated]
    
    def get_queryset(self, user_email):
        """Returns filtered enrolled courses"""
        return StudentsEnrolled.objects.filter(email_address=user_email)

    def get(self, request):
        """Get all courses for the current authenticated user """
        # TODO: Function only available to students
        # user_email_address = request.user.email
        user_email_address = "aaron75@alaska.edu" # TODO: Using as a temp email address 
        enrolled_courses = self.get_queryset(user_email_address)
        serialized_courses = StudentsEnrolledSerializer(enrolled_courses, many=True)
        return Response(serialized_courses.data)

    def post(self, request):
        """Add a new enrolled course"""
        # TODO: Function only available to admins
        serializer = StudentsEnrolledSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)