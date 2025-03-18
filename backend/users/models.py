# Create your models here.
from django.db import models
from django.contrib.auth.models import User, Group, Permission

class RoleSetup:
    @staticmethod
    def create_roles():
        system_admin_group, created = Group.objects.get_or_create(name='System Admin')
        admin_group, created = Group.objects.get_or_create(name='Admin')
        faculty_group, created = Group.objects.get_or_create(name='Faculty')
        student_group, created = Group.objects.get_or_create(name='Student')

        # Assign permissions (example with User model's permissions)
        permissions = Permission.objects.filter(content_type__app_label='auth', content_type__model='user')

        '''
        Ignore the permissions and restrictions, they still need to be updated
        '''

        # System Admin 
        system_admin_group.permissions.set(permissions)

        # Admin 
        admin_group.permissions.set(permissions)

        # Faculty
        faculty_group.permissions.add(*permissions.exclude(codename__in=['delete_user']))

        # Student
        student_group.permissions.add(permissions.get(codename='view_user'))  # Regular user only views