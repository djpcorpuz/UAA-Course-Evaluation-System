# services.py  
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from typing import Dict, Any
import jwt
import requests

def google_get_access_token(code: str, redirect_uri: str) -> str:
    data = {
        'code': code,
        'client_id': settings.GOOGLE_OAUTH2_CLIENT_ID,
        'client_secret': settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }

    response = requests.post(settings.GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

    if not response.ok:
        raise ValidationError('Failed to obtain access token from Google.')

    access_token = response.json()['access_token']
    return access_token

def google_get_user_info(access_token: str) -> Dict[str, Any]:
    response = requests.get(
        settings.GOOGLE_USER_INFO_URL,
        params={'access_token': access_token}
    )

    if not response.ok:
        raise ValidationError('Failed to obtain user info from Google.')

    return response.json()

def create_user_and_token(user_data: Dict[str, Any]) -> Dict:
    User = get_user_model()

    user, created = User.objects.get_or_create(
        email=user_data['email'],
        defaults={
            'username': user_data['email'],
            'first_name': user_data.get('given_name', ''),
            'last_name': user_data.get('family_name', '')
        }
    )

    token_payload = {
        'sub': user.username,
        'email': user.email,
        # Other user info as needed
    }

    token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')

    return {
        'user': user,
        'token': token 
    }