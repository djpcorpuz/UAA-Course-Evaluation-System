# Create your tests here.
from django.test import TestCase
from django.contrib.auth.models import User, Group
from django.contrib.auth.models import Permission
from users.models import RoleSetup

class PermissionsTestCase(TestCase):
    
    def setUp(self):
        # Create users and assign to existing groups
        RoleSetup.create_roles_and_permissions()
        
        self.system_admin_user = User.objects.create_user(username='system_admin_user', password='system_adminpass')
        self.admin_user = User.objects.create_user(username='admin_user', password='adminpass')
        self.faculty_user = User.objects.create_user(username='faculty_user', password='facultypass')
        self.student_user = User.objects.create_user(username='student_user', password='studentpass')

        # Retrieve pre-existing groups (roles)
        self.system_admin_group = Group.objects.get(name='System Admin')
        self.admin_group = Group.objects.get(name='Admin')
        self.faculty_group = Group.objects.get(name='Faculty')
        self.student_group = Group.objects.get(name='Student')

        # Assign users to groups
        self.system_admin_user.groups.add(self.system_admin_group)
        self.admin_user.groups.add(self.admin_group)
        self.faculty_user.groups.add(self.faculty_group)
        self.student_user.groups.add(self.student_group)

    # Check if the admin user has specific permissions based on role
    def test_system_admin_permissions(self):
        self.assertTrue(self.system_admin_user.has_perm('users.set_system_admin'))
        self.assertTrue(self.system_admin_user.has_perm('users.set_admin'))
        self.assertTrue(self.system_admin_user.has_perm('users.approve_set'))
        self.assertTrue(self.system_admin_user.has_perm('users.reject_set'))
        self.assertTrue(self.system_admin_user.has_perm('users.set_timelock'))
        self.assertTrue(self.system_admin_user.has_perm('users.set_faculty'))
        self.assertTrue(self.system_admin_user.has_perm('users.set_student'))
        self.assertTrue(self.system_admin_user.has_perm('users.edit_default'))
        self.assertFalse(self.system_admin_user.has_perm('users.view_records'))
        self.assertFalse(self.system_admin_user.has_perm('users.edit_custom'))
        self.assertFalse(self.system_admin_user.has_perm('users.submit_answer'))

    # Check if the admin user has specific permissions based on role
    def test_admin_permissions(self):
        self.assertFalse(self.admin_user.has_perm('users.set_system_admin'))
        self.assertFalse(self.admin_user.has_perm('users.set_admin'))
        self.assertTrue(self.admin_user.has_perm('users.approve_set'))
        self.assertTrue(self.admin_user.has_perm('users.reject_set'))
        self.assertTrue(self.admin_user.has_perm('users.set_timelock'))
        self.assertTrue(self.admin_user.has_perm('users.set_faculty'))
        self.assertTrue(self.admin_user.has_perm('users.set_student'))
        self.assertTrue(self.admin_user.has_perm('users.edit_default'))
        self.assertFalse(self.admin_user.has_perm('users.view_records'))
        self.assertFalse(self.admin_user.has_perm('users.edit_custom'))
        self.assertFalse(self.admin_user.has_perm('users.submit_answer'))

    # Check if the faculty user has view_records permission
    def test_faculty_permissions(self):
        self.assertFalse(self.faculty_user.has_perm('users.set_system_admin'))
        self.assertFalse(self.faculty_user.has_perm('users.set_admin'))
        self.assertFalse(self.faculty_user.has_perm('users.approve_set'))
        self.assertFalse(self.faculty_user.has_perm('users.reject_set'))
        self.assertFalse(self.faculty_user.has_perm('users.set_timelock'))
        self.assertFalse(self.faculty_user.has_perm('users.set_faculty'))
        self.assertFalse(self.faculty_user.has_perm('users.set_student'))
        self.assertFalse(self.faculty_user.has_perm('users.edit_default'))
        self.assertTrue(self.faculty_user.has_perm('users.view_records'))
        self.assertTrue(self.faculty_user.has_perm('users.edit_custom'))
        self.assertFalse(self.faculty_user.has_perm('users.submit_answer'))

    # Check if the student user has submit_answer permission
    def test_student_permissions(self):
        self.assertFalse(self.student_user.has_perm('users.set_system_admin'))
        self.assertFalse(self.student_user.has_perm('users.set_admin'))
        self.assertFalse(self.student_user.has_perm('users.approve_set'))
        self.assertFalse(self.student_user.has_perm('users.reject_set'))
        self.assertFalse(self.student_user.has_perm('users.set_timelock'))
        self.assertFalse(self.student_user.has_perm('users.set_faculty'))
        self.assertFalse(self.student_user.has_perm('users.set_student'))
        self.assertFalse(self.student_user.has_perm('users.edit_default'))
        self.assertFalse(self.student_user.has_perm('users.view_records'))
        self.assertFalse(self.student_user.has_perm('users.edit_custom'))
        self.assertTrue(self.student_user.has_perm('users.submit_answer'))