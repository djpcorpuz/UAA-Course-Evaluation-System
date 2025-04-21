# middleware.py
import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from django.utils.functional import SimpleLazyObject
from rest_framework.request import Request

User = get_user_model()

def get_user_from_token(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header or not auth_header.startswith('Bearer '):
        return AnonymousUser()

    token = auth_header.split(' ')[1]

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return AnonymousUser()
    except Exception:
        return AnonymousUser()

    user = User.objects.filter(username=payload['sub']).first()
    return user or AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: Request):
        request.user = SimpleLazyObject(lambda: get_user_from_token(request))
        return self.get_response(request)