from rest_framework import serializers
from .models import StudentsEnrolled, CourseAnswers, Courses, InstructorsOfCourses, Instructors, DeliveryMethods, SurveySets, SurveyQuestions, QuestionTypes
from django.contrib.auth.models import User

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

        def create(self,validated_data):
            user = User.objects.create_user(**validated_data)   
            return user



class StudentsEnrolledSerializer(BaseSchema):    
    class Meta:
        model = StudentsEnrolled
        exclude = ['pk']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data.pop("email_address")
        try:
            course = Courses.objects.get(crn=instance.crn, term=instance.term)
            course_data = {
                "subject": course.subject,
                "course_number": course.course_number,
                "title": course.title
            }
            data.update(course_data)
        except Courses.DoesNotExist:
            data.update({"error": "Course doesn't exist"})

        return data
    
class CourseAnswersSerializer(BaseSchema):
    # Custom foreign key declarations
    question = serializers.CharField(source='question_id.question', read_only=True)

    class Meta:
        model = CourseAnswers
        fields = '__all__'

class DeliveryMethodsSerializer(BaseSchema):
    class Meta:
        model = DeliveryMethods
        fields = '__all__'

class SurveySetsSerializer(BaseSchema):
    # Custom field
    questions = serializers.SerializerMethodField()

    class Meta:
        model = SurveySets
        fields = '__all__'

    def get_questions(self, obj):
        """
        SurveySets table on column question_ids is an array.
        Retrieves from SurveyQuestions table based on column questions_ids.
        """
        question_ids = obj.question_ids
        questions = SurveyQuestions.objects.filter(question_id__in=question_ids)
        return SurveyQuestionsSerializer(questions, many=True).data

class QuestionTypesSerializer(BaseSchema):
    class Meta:
        model = QuestionTypes
        fields = '__all__'

class SurveyQuestionsSerializer(BaseSchema):
    # Custom field
    question_type = serializers.SerializerMethodField()

    class Meta:
        model = SurveyQuestions
        fields = '__all__'
    
    def get_question_type(self, obj):
        """ 
        Retrieve the details of the related QuestionType based on the question_type (option_id) 
        of the SurveyQuestion.
        """
        question_type = obj.question_type
        question_type_details = QuestionTypes.objects.filter(option_id=question_type).first()
        if question_type_details:
            return QuestionTypesSerializer(question_type_details).data
        return None

class CoursesSerializer(BaseSchema):
    # Custom foreign key declarations
    delivery_method_id = DeliveryMethodsSerializer()
    survey_set_id = SurveySetsSerializer()

    class Meta:
        model = Courses
        exclude = ['pk']
    
    def to_representation(self, instance):
        """Pretty the Serialization"""
        representation = super().to_representation(instance)
        
        # Extract the survey questions
        survey_questions = []
        for question in representation['survey_set_id']['questions']:
            # Correct the dictionary key formatting
            question_obj = {
                'question': question['question'],
                'values': question['question_type']['value']
            }
            survey_questions.append(question_obj)

        custom_representation = {
            'delivery_method': representation['delivery_method_id']['name'],
            'survey_questions': survey_questions,
            'crn': representation['crn'],
            'term': representation['term'],
            "campus_id": representation['campus_id'],
            'subject': representation['subject'],
            'course_number': representation['course_number'],
            'title': representation['title']
        }
        return custom_representation

class InstructorsOfCoursesSerializer(BaseSchema):
    class Meta:
        model = InstructorsOfCourses
        exclude = ['pk']

class InstructorsSerializer(BaseSchema):
    class Meta:
        model = Instructors
        fields = '__all__'