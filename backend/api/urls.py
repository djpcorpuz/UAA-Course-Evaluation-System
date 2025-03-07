from django.urls import path
from .views import StudentEnrolledCourseView, StudentSurveyQuestionsView, StudentSubmitSurveyAnswerView
from .views import FacultyViewAnswersView

urlpatterns = [
    # Student endpoints
    path('student/enrolled-courses', StudentEnrolledCourseView.as_view(), name='get-student-enrolled-courses'),
    path('student/survey-questions/<int:crn>/<int:term>/', StudentSurveyQuestionsView.as_view(), name='get_enrolled_courses'),
    path('student/submit-course-answers', StudentSubmitSurveyAnswerView.as_view(), name="post-student-course-answers"),

    # Faculty endpoints
    path('faculty/view-answers', FacultyViewAnswersView.as_view(), name='get-faculty-view-answers'),

    # Admin endpoints
]