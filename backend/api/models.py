from django.db import models

class StudentsEnrolled(models.Model):
    class Meta:
        db_table = 'students_enrolled'       

    pk = models.CompositePrimaryKey('email_address', 'crn', 'term')
    email_address = models.CharField(max_length=255)
    crn = models.IntegerField()
    term = models.IntegerField()
    took_survey = models.BooleanField()

class QuestionTypes(models.Model):
    class Meta:
        db_table = 'question_types'

    option_id = models.IntegerField(primary_key=True)
    value = models.JSONField()

class SurveyQuestions(models.Model):
    class Meta:
        db_table = 'survey_questions'
        
    question_id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=255)
    question_type = models.IntegerField()

class CourseAnswers(models.Model):
    class Meta:
        db_table = 'course_answers'
    
    answer_id = models.AutoField(primary_key=True)
    crn = models.IntegerField()
    term = models.IntegerField()
    question_id = models.ForeignKey(SurveyQuestions, on_delete=models.PROTECT, db_column='question_id')
    value = models.JSONField()

class DeliveryMethods(models.Model):
    class Meta:
        db_table = 'delivery_methods'

    delivery_method_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)

class SurveySets(models.Model):
    class Meta:
        db_table = 'survey_sets'

    set_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    question_ids = models.JSONField()
    default = models.BooleanField(default=False)

class Courses(models.Model):
    class Meta:
        db_table = 'courses'
    
    pk = models.CompositePrimaryKey('crn', 'term')
    crn = models.IntegerField()
    term = models.IntegerField()
    campus_id = models.IntegerField(null=True)
    subject = models.CharField(max_length=255)
    course_number = models.CharField(max_length=255)
    section = models.IntegerField()
    title = models.CharField(max_length=255)
    delivery_method_id = models.ForeignKey(DeliveryMethods, on_delete=models.PROTECT, db_column='delivery_method_id')
    survey_set_id = models.ForeignKey(SurveySets, on_delete=models.PROTECT, db_column='survey_set_id')
    edit_lock_by = models.IntegerField(null=True, blank=True)
    survey_start = models.CharField(max_length=255, null=True, blank=True) 
    survey_end = models.CharField(max_length=255, null=True, blank=True)

class InstructorsOfCourses(models.Model):
    class Meta:
        db_table = 'instructors_of_courses'
    
    pk = models.CompositePrimaryKey('email_address', 'crn', 'term')
    email_address = models.CharField(max_length=255)
    crn = models.IntegerField()
    term = models.IntegerField()

class Instructors(models.Model):
    class Meta:
        db_table = 'instructors'
    
    email_address = models.CharField(max_length=255, primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

