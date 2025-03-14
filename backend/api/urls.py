from django.urls import path
from .views import StudentEnrolledCourseView, StudentSurveyQuestionsView, StudentSubmitSurveyAnswerView
from .views import FacultyAvailableCoursesView, FacultyViewAnswersView, FacultyManageQuestionsView
from .views import AdminCreateCoursesView, AdminManageSurvey 

urlpatterns = [
    # Student endpoints
    path('student/enrolled-courses', StudentEnrolledCourseView.as_view(), name='get-student-enrolled-courses'),
    path('student/survey-questions/<int:crn>/<int:term>/', StudentSurveyQuestionsView.as_view(), name='get_enrolled_courses'),
    path('student/submit-course-answers', StudentSubmitSurveyAnswerView.as_view(), name="post-student-course-answers"),

    # Faculty endpoints
    path('faculty/taught-courses', FacultyAvailableCoursesView.as_view(), name='get-faculty-taught-courses'),
    path('faculty/view-answers', FacultyViewAnswersView.as_view(), name='post-faculty-view-answers'),
    path('faculty/manage-questions', FacultyManageQuestionsView.as_view(), name='post-faculty-manage-questions'),

    # Admin endpoints
    path('admin/create-courses', AdminCreateCoursesView.as_view(), name='post-get-admin-create-courses'),
    path('admin/manage-surveys', AdminManageSurvey.as_view(), name='post-manage-surveys')

]