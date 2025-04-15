from google.oauth2 import id_token
from google.auth.transport import requests

def validate_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request())
        if idinfo['hd'] != 'alaska.edu':
            # Not in domain
            raise ValueError('Invalid host domain')
        return idinfo

    except ValueError:
        # Invalid token
        return None
