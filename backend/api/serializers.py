from rest_framework import serializers
from .models import StudentsEnrolled, CourseAnswers, Courses, InstructorsOfCourses, Instructors, DeliveryMethods, SurveySets, SurveyQuestions, QuestionTypes

class BaseSchema(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        # Pop the custom 'exclude_attributes' argument
        exclude_attributes = kwargs.pop('exclude_attributes', [])
        
        # Initialize the parent class
        super().__init__(*args, **kwargs)
        
        # Remove the fields passed in 'exclude_attributes'
        for field in exclude_attributes:
            if field in self.fields:
                self.fields.pop(field)

class StudentsEnrolledSerializer(BaseSchema):
    class Meta:
        model = StudentsEnrolled
        exclude = ['pk']
    
class CourseAnswersSerializer(BaseSchema):
    # Custom foreign key declarations
    question = serializers.CharField(source='question_id.question', read_only=True)

    class Meta:
        model = CourseAnswers
        fields = '__all__'

class CoursesSerializer(BaseSchema):
    class Meta:
        model = Courses
        fields = '__all__'

class InstructorsOfCoursesSerializer(BaseSchema):
    class Meta:
        model = InstructorsOfCourses
        fields = '__all__'

class InstructorsSerializer(BaseSchema):
    class Meta:
        model = Instructors
        fields = '__all__'

class DeliveryMethodsSerializer(BaseSchema):
    class Meta:
        model = DeliveryMethods
        fields = '__all__'

class SurveySetsSerializer(BaseSchema):
    class Meta:
        model = SurveySets
        fields = '__all__'

class SurveyQuestionsSerializer(BaseSchema):
    class Meta:
        model = SurveyQuestions
        fields = '__all__'

class QuestionTypesSerializer(BaseSchema):
    class Meta:
        model = QuestionTypes
        fields = '__all__'