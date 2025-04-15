from django.test import TestCase
import unittest
from datetime import datetime, timedelta
import jwt

# Create your tests here.

class GoogleAuthTokenTestCases(unittest.TestCase):
    SECRET_KEY = 'secret-test-key'

    def create_token(self, payload):
        return jwt.encode(payload, self.SECRET_KEY, algorithm='HS256')

    def test_valid_token(self):
        payload = {'sub': 'user123', 'exp': datetime.utcnow() + timedelta(minutes=5)}
        token = self.create_token(payload)
        decoded = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])
        self.assertEqual(decoded['sub'], 'user123')

    def test_expired_token(self):
        payload = {'sub': 'user123', 'exp': datetime.utcnow() - timedelta(minutes=5)}
        token = self.create_token(payload)
        with self.assertRaises(jwt.ExpiredSignatureError):
            jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])

    def test_malformed_token(self):
        malformed_token = "malformed.token.here"
        with self.assertRaises(jwt.DecodeError):
            jwt.decode(malformed_token, self.SECRET_KEY, algorithms=['HS256'])

    def test_invalid_signature(self):
        payload = {'sub': 'user123', 'exp': datetime.utcnow() + timedelta(minutes=5)}
        token = self.create_token(payload)[:-1]  # Tamper with the token
        with self.assertRaises(jwt.InvalidSignatureError):
            jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])

    def test_token_with_invalid_scope(self):
        payload = {'sub': 'user123', 'scope': 'read-only', 'exp': datetime.utcnow() + timedelta(minutes=5)}
        token = self.create_token(payload)
        decoded = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])
        self.assertNotEqual(decoded['scope'], 'write-access')

    def test_valid_refresh_token(self):
        payload = {'sub': 'user123', 'exp': datetime.utcnow() + timedelta(days=7)}
        refresh_token = self.create_token(payload)
        decoded = jwt.decode(refresh_token, self.SECRET_KEY, algorithms=['HS256'])
        self.assertEqual(decoded['sub'], 'user123')

    def test_invalid_refresh_token(self):
        payload = {'sub': 'user123', 'exp': datetime.utcnow() - timedelta(days=7)}
        refresh_token = self.create_token(payload)
        with self.assertRaises(jwt.ExpiredSignatureError):
            jwt.decode(refresh_token, self.SECRET_KEY, algorithms=['HS256'])

if __name__ == '__main__':
    unittest.main()