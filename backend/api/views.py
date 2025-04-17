from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.dateparse import parse_datetime
from django.shortcuts import redirect
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User 
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from allauth.socialaccount.models import SocialToken, SocialAccount
from .serializers import StudentsEnrolledSerializer, CourseAnswersSerializer, CoursesSerializer, InstructorsOfCoursesSerializer, UserSerializer
from .models import StudentsEnrolled, CourseAnswers, SurveyQuestions, Courses, InstructorsOfCourses, SurveySets
import json

# Google Authentication

User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user)
    print("Social Account for user:", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

    if token:
        print('Google token found:', token.token)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    else:
        print('No Google token found for user', user)
        return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')

@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    return JsonResponse({'detail': 'Method not allowed.'}, status=405)

##### Student View #####

class StudentEnrolledCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self, user_email):
        """Returns filtered enrolled courses"""
        return StudentsEnrolled.objects.filter(email_address=user_email)

    def get(self, request):
        """Get all courses for the current authenticated user """

        # TODO: Function only available to students
        if not request.user.has_perm('users.view_survey'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        user_email_address = request.user.email
        enrolled_courses = self.get_queryset(user_email_address)
        serialized_courses = StudentsEnrolledSerializer(enrolled_courses, many=True)
        return Response(serialized_courses.data)

class StudentSurveyQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, crn, term):
        """
        Get survey questions.

        Args:
            request (dict): Default obj.
            crn (str): The specified course.
            term (str): The specified year.
        """
        # TODO: Function only available to students
        if not request.user.has_perm('users.view_survey'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Verify that student is enrolled in the course
        try:
            user_email_address = request.user.email
            student_is_enrolled = StudentsEnrolled.objects.filter(email_address=user_email_address, crn=crn, term=term).exists()
            if student_is_enrolled is False:
                return Response({"status": "error", "message": f"Not enrolled in course: crn={crn},  term={term}"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print({str(e)})
            return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            courses = Courses.objects.filter(crn=crn, term=term).select_related("delivery_method_id", "survey_set_id")
            serializer = CoursesSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)        
        except Exception as e:
            print({str(e)})
            return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentSubmitSurveyAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Add student survey answers.

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
        if not request.user.has_perm('users.submit_answer'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            course_details = request.data.get("course")
            answers_data = request.data.get("answers")
            crn = course_details.get("crn")
            term = course_details.get("term")

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

##### Faculty View #####

class FacultyAvailableCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self, user_email):
        """Returns filtered taught courses"""
        return InstructorsOfCourses.objects.filter(email_address=user_email)

    def get(self, request):
        """Get all courses for the current authenticated user"""

        # TODO: Function only available to faculty
        if not request.user.has_perm('users.view_records'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Get associated courses
            user_email_address = request.user.email
            taught_courses = self.get_queryset(user_email_address)

            # Get course details
            course_detail_list = []
            for course in taught_courses:
                crn = course.crn
                term = course.term

                # Query the Courses table to get course details based on crn and term
                course_details = Courses.objects.filter(crn=crn, term=term).first()

                if course_details:
                    # Serialize the course details (assuming you have a serializer for Courses)
                    course_details_data = CoursesSerializer(course_details).data
                    course_detail_list.append(course_details_data)
            
            return Response({"courses_details": course_detail_list})
        except Exception as e:
            print({str(e)})
            return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FacultyViewAnswersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
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
        if not request.user.has_perm('users.view_records'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            course_details = request.data.get("course")
            crn = course_details.get("crn")
            term = course_details.get("term")

            # Filter query
            course_answers = CourseAnswers.objects.filter(crn=crn, term=term).select_related("question_id")
            serialized_course_answers = CourseAnswersSerializer(course_answers, many=True, exclude_attributes=["question_id"])
        
            return Response(serialized_course_answers.data)
        except Exception as e:
            print({str(e)})
            return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FacultyManageQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        All courses get a default list. (Designated by column default is True)
        A faculty can add additional questions:
            - Create a new set for the course
            - Copy the default list into set
            - Append new questions
        
        The faculty shouldn't be able to edit the default list.

        Args:
            request (dict): Data of course and set changes
                {
                    "course": {
                        "crn": 30399,
                        "term": 202501
                    },
                    "questions": {
                        "add": [
                            {
                                "question": "New question",
                                "type": 0
                            }
                        ],
                        "update": [
                            {
                                "question_id": 4,
                                "question": "Update question",
                                "type": 0
                            }
                        ],
                        "remove": []
                    }
                }
        """
        # TODO: Function only available to faculty
        if not request.user.has_perm('users.edit_custom'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        course_data = request.data.get("course", {})
        question_changes = request.data.get("questions", {})

        fetched_course_data = Courses.objects.filter(crn=course_data["crn"], term=course_data["term"]).values().first()
        current_set_id = fetched_course_data["survey_set_id_id"]
        default_set_obj = SurveySets.objects.filter(default=True).values().first()

        # The current course set_id is the default survey set
        # Create a new survey set (copy the default survey set)
        if fetched_course_data["survey_set_id_id"] == default_set_obj["set_id"]:
            new_survey_set = SurveySets(
                # set_id is auto generated
                name = f"{course_data['crn']}, {course_data['term']}",
                question_ids = default_set_obj["question_ids"]
            )
            new_survey_set.save()
            
            # Update the Course set id to be the newly created survey set id
            Courses.objects.filter(crn=course_data["crn"], term=course_data["term"]).update(survey_set_id_id=new_survey_set.set_id)

            # Update to allow synchronization till the end of function 
            current_set_id = new_survey_set.set_id 
           
        add_questions = question_changes.get("add", [])
        update_questions = question_changes.get("update", [])
        remove_questions = question_changes.get("remove", [])

        # Parse add questions
        if len(add_questions) > 0:
            for obj in add_questions:
                new_survey_question = SurveyQuestions (
                    # question id auto generated
                    question = obj["question"],
                    question_type = obj["type"]
                )
                new_survey_question.save()

                # Append new survey question to set
                survey_set = SurveySets.objects.get(set_id=current_set_id)
                survey_set.question_ids.append(new_survey_question.question_id)
                survey_set.save()
                
        # Parse update questions
        if len(update_questions) > 0:
            for obj in update_questions:
                survey_question = SurveyQuestions.objects.filter(question_id=obj["question_id"]).first()
        
                if survey_question:
                    survey_question.question = obj["question"]
                    survey_question.type = obj["type"]
                    survey_question.save()

        # Parse remove questions
        if len(remove_questions) > 0:
            for question_id in remove_questions:
                # Delete the question from SurveyQuestions table
                survey_question = SurveyQuestions.objects.filter(question_id=question_id).first()
                if survey_question:
                    survey_question.delete()  # Delete the survey question from the database

                # Update the SurveySets table by removing the question_id from the question_ids array
                survey_set = SurveySets.objects.get(set_id=current_set_id)
                if survey_set and (question_id in survey_set.question_ids):  
                    survey_set.question_ids.remove(question_id) # Remove the question_id from the array
                    survey_set.save()

        updated_survey = Courses.objects.filter(crn=course_data["crn"], term=course_data["term"]).first()
        updated_survey_serialized = CoursesSerializer(updated_survey).data
        return Response({"course_detail": updated_survey_serialized}, status=status.HTTP_201_CREATED)  

##### Admin View #####

class AdminCreateCoursesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Fetch all the courses
        """
        # TODO: Function only available to admin
        if not request.user.has_perm('users.create_course'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        courses = Courses.objects.all() # TODO: Update to allow for filters and pagination
        serialized_courses = CoursesSerializer(courses, many=True)
        return Response(serialized_courses.data, status=status.HTTP_200_OK)

    # def post(self, request):
    #     # Bulk append courses
    #     pass

class AdminManageSurvey(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Set all courses lock edit questions. (Type: lock-questions)
        Set allowed times to complete survey. (Type: survey-start)

        Args:
            request (dict): Data of course and type of action
            e.g
                {
                    "course": {
                        "term": 202501
                    },
                    "type": "lock-questions",
                    "lock-by": "2025-03-14T07:00:00+00:00"
                }
        """
        # TODO: Function only available to admin
        if not request.user.has_perm('users.set_timelock'):
            return Response({"status": "error", "message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        type = request.data.get("type", None)
        course = request.data.get("course", {})

        if type == "lock-questions":
            term = course.get("term")
            lock_by = request.data.get("lock-by")

            if term is None or lock_by is None:
                return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                dt_lock_by = parse_datetime(lock_by)
                updated = Courses.objects.filter(term=term).update(edit_lock_by=dt_lock_by)
                if updated:
                    return Response({"message": "Course questions locked successfully"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        if type == "survey-start":
            term = course.get("term")
            start_by = request.data.get("survey-start")
            end_by = request.data.get("survey-end")

            if start_by is None or end_by is None:
                return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                dt_start_by = parse_datetime(start_by)
                dt_end_by = parse_datetime(end_by)

                # Validate that start is before end
                if dt_start_by >= dt_end_by:
                    return Response({"error": "Start date needs to before end date"}, status=status.HTTP_400_BAD_REQUEST)

                updated = Courses.objects.filter(term=term).update(survey_start=dt_start_by, survey_end=dt_end_by)
                if updated:
                    return Response({"message": "Course survey start and end time set successfully"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"status": "error", "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "Invalid or missing 'type' field."}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
