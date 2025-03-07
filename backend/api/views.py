from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import StudentsEnrolledSerializer, CourseAnswersSerializer
from rest_framework.permissions import IsAuthenticated
from .models import StudentsEnrolled, CourseAnswers,SurveyQuestions


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
    
class CourseAnswersView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Get courses survey answers

        Args: 
            request (dict): Data about course survey answers
                {
                    "course": {
                        "crn": 30399,
                        "term": 202501
                    }
                }
        """
        # TODO: Function only available to faculty

        try:
            course_details = request.data.get("course")
            crn = course_details.get('crn')
            term = course_details.get('term')

            # Filter query
            course_answers = CourseAnswers.objects.filter(crn=crn, term=term).select_related('question_id')
            serialized_course_answers = CourseAnswersSerializer(course_answers, many=True, exclude_attributes=["question_id"])
        
            return Response(serialized_course_answers.data)
        except Exception as e:
            print({str(e)})
            return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def post(self, request):
        """
        Add student survey answers

        Args:
            request (dict): Data about course and survey answers
                {
                    "course": {
                        "crn": 30399,
                        "term": 202501
                    },
                    "answers": {
                        "1": value1, [question_id]: [value]
                        "2": value2 [question_id]: [value]
                    }
                }
        """
        # TODO: Function only available to students

        try:
            course_details = request.data.get("course")
            answers_data = request.data.get("answers")
            crn = course_details.get('crn')
            term = course_details.get('term')

            # Loop through the data
            course_answers = []
            for question_id, answer in answers_data.items():
                # SurveyQuestion instance, required because question_id field is foreign key
                question_instance = SurveyQuestions.objects.get(question_id=question_id) 

                course_answer = CourseAnswers(
                    # answer_id is auto generated
                    crn = crn,
                    term = term,
                    question_id=question_instance,
                    value=answer,
                )
                course_answers.append(course_answer)

            CourseAnswers.objects.bulk_create(course_answers)
            return Response({"status: success"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print({str(e)})
            return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)