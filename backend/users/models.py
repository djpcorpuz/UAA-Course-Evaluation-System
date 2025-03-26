# Create your models here.
from email.policy import default
import time
from django.db import models
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType

# MyModel = Custom Permissions Table? Need to confirm
class CourseEvaluations(models.Model):
    name = models.CharField(max_length = 100)                   # Name of custom permission
    description = models.TextField()                            # Description of custom permission

    # Insert custom permissions into Meta class
    class Meta:
        permissions = [
            ('set_system_admin','set to system admin'),         # sets user to system admin
            ('set_admin','set to admin'),                       # sets user to admin
            ('approve_set','can approve set'),                  # approve custom question set
            ('reject_set','can reject set'),                    # reject custom question set
            ('set_timelock','can set timelocks'),               # sets timelocks for editing/modifying question sets, submitting answers, etc
            ('set_faculty','set to faculty'),                   # sets user to faculty
            ('set_student','set to student'),                   # sets user to student (may remove since this should be default?)
            ('edit_default', 'can edit the default set'),       # edits default question set
            ('view_records','can view submitted answers'),      # view previous semester submissions
            ('edit_custom','can edit the custom set'),          # edit custom question set
            ('submit_answer','can submit survey answers'),      # submit answers to the course sets
            ]

class RoleSetup:
    @staticmethod
    def create_roles_and_permissions():
        content_type = ContentType.objects.get_for_model(CourseEvaluations)

        #Initializing permissions
        #-------------------------------------
        set_system_admin_perm, created = Permission.objects.get_or_create(codename='set_system_admin', content_type=content_type)
        set_admin_perm, created = Permission.objects.get_or_create(codename='set_admin', content_type=content_type)
        approve_perm, created = Permission.objects.get_or_create(codename='approve_set', content_type=content_type)
        reject_perm, created = Permission.objects.get_or_create(codename='reject_set', content_type=content_type)
        time_perm, created = Permission.objects.get_or_create(codename='set_timelock', content_type=content_type)
        faculty_perm, created = Permission.objects.get_or_create(codename='set_faculty', content_type=content_type)
        student_perm, created = Permission.objects.get_or_create(codename='set_student', content_type=content_type)
        default_perm, created = Permission.objects.get_or_create(codename='edit_default', content_type=content_type)
        records_perm, created = Permission.objects.get_or_create(codename='view_records', content_type=content_type)
        custom_perm, created = Permission.objects.get_or_create(codename='edit_custom', content_type=content_type)
        answer_perm, created = Permission.objects.get_or_create(codename='submit_answer', content_type=content_type)


        #Initializing roles
        #-------------------------------------
        system_admin_group, created = Group.objects.get_or_create(name='System Admin')
        admin_group, created = Group.objects.get_or_create(name='Admin')
        faculty_group, created = Group.objects.get_or_create(name='Faculty')
        student_group, created = Group.objects.get_or_create(name='Student')

        # Assign permissions
        #-------------------------------------

            # System Admin 
        system_admin_permissions = [set_system_admin_perm, set_admin_perm, approve_perm, reject_perm, time_perm, faculty_perm, student_perm, default_perm]
        system_admin_group.permissions.set(system_admin_permissions)

            # Admin 
        admin_permissions = [approve_perm, reject_perm, time_perm, faculty_perm, student_perm, default_perm]
        admin_group.permissions.set(admin_permissions)

            # Faculty
        faculty_permissions = [records_perm, custom_perm]
        faculty_group.permissions.set(faculty_permissions)

            # Student
        student_permissions = [answer_perm]
        student_group.permissions.set(student_permissions)