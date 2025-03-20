# Create your models here.
from django.db import models
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType

# MyModel = Custom Permissions Table? Need to confirm
class MyModel(models.Model):
    name = models.CharField(max_length = 100)                   # Name of custom permission
    description = models.TextField()                            # Description of custom permission

    # Insert custom permissions into Meta class
    class Meta:
        permissions = [
            #System Admin
            ('set_system_admin','promote to system admin')
            #Admin
            ('approve','can approve set'),                      # approve custom question set
            ('reject','can reject set'),                        # reject custom question set
            ('set_timelock','can set timelocks'),               # sets timelocks for editing/modifying question sets, submitting answers, etc
            ('set_faculty','promote to faculty'),
            ('set_student','promote to student'),
            #Faculty
            ('view_records','can view submitted answers'),
            ('edit_set','can edit set'),
            #Student
            ('submit_answer','can submit survey answers'),
            ]

class RoleSetup:
    @staticmethod
    def create_roles_and_permissions():
        content_type = ContentType.objects.get_for_model(MyModel)

        #Initializing permissions
        view_perm = Permission.objects.get(codename='view_mymodel', content_type=content_type)
        add_perm = Permission.objects.get(codename='add_mymodel', content_type=content_type)
        change_perm = Permission.objects.get(codename='change_mymodel', content_type=content_type)
        delete_perm = Permission.objects.get(codename='delete_mymodel', content_type=content_type)
        #add remaining perms

        #Initializing roles
        system_admin_group, created = Group.objects.get_or_create(name='System Admin')
        admin_group, created = Group.objects.get_or_create(name='Admin')
        faculty_group, created = Group.objects.get_or_create(name='Faculty')
        student_group, created = Group.objects.get_or_create(name='Student')

        # Assign permissions (example with User model's permissions)
        permissions = Permission.objects.filter(content_type__app_label='auth', content_type__model='user')

         ## TO DO ## 
            # System Admin 
        system_admin_group.permissions.set(permissions)

            # Admin 
        admin_group.permissions.set(permissions)

            # Faculty
        faculty_group.permissions.add(*permissions.exclude(codename__in=['delete_user']))

            # Student
        student_group.permissions.add(permissions.get(codename='view_user'))  # Regular user only views