from django.db import models
from django.db.models import UniqueConstraint


# Create your models here.
class StudentsEnrolled(models.Model):
    class Meta:
        db_table = 'students_enrolled'       

    pk = models.CompositePrimaryKey('email_address', 'crn', 'term')
    email_address = models.CharField(max_length=255)
    crn = models.IntegerField() # pk
    term = models.IntegerField() # pk
    took_survey = models.BooleanField()
    
class CourseAnswers(models.Model):
    class Meta:
        db_table = "course_answers"
    
    answer_id = models.IntegerField(primary_key=True)
    crn = models.IntegerField()
    term = models.IntegerField()
    question_id = models.IntegerField()
    value = models.JSONField()

class Courses(models.Model):
    class Meta:
        db_table = "courses"
    
    crn = models.IntegerField(primary_key=True)
    term = models.IntegerField() # pk
    campus = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    course_number = models.CharField(max_length=255)
    section = models.IntegerField()
    title = models.CharField(max_length=255)
    delivery_methods = models.JSONField()
    survey_set_id = models.IntegerField()
    edit_lock_by = models.IntegerField()
    survey_start = models.CharField(max_length=255)
    survey_end = models.CharField(max_length=255)

class InstructorsOfCourses(models.Model):
    class Meta:
        db_table = "instructors_of_courses"
    
    email_address = models.CharField(max_length=255, primary_key=True)
    crn = models.IntegerField() # pk
    term = models.IntegerField() # pk

class Instructors(models.Model):
    class Meta:
        db_table = "instructors"
    
    email_address = models.CharField(max_length=255, primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

class DeliveryMethods(models.Model):
    class Meta:
        db_table = "delivery_methods"

    delivery_method_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)

class SurveySets(models.Model):
    class Meta:
        db_table = "survey_sets"

    set_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    question_ids = models.JSONField()

class SurveyQuestions(models.Model):
    class Meta:
        db_table = "survey_questions"
        
    question_id = models.IntegerField(primary_key=True)
    question = models.CharField(max_length=255)
    question_id = models.IntegerField()

class QuestionTypes(models.Model):
    class Meta:
        db_table = "question_types"

    option_id = models.IntegerField(primary_key=True)
    value = models.JSONField()

