from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import User


class TokenRefreshTests(APITestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email="buyer@example.com",
			password="password",
			name="Buyer",
		)

	def test_login_tokens_have_expected_lifetimes(self):
		response = self.client.post(
			reverse("login"),
			{"email": "buyer@example.com", "password": "password"},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		access = AccessToken(response.data["access"])
		refresh = RefreshToken(response.data["refresh"])
		self.assertEqual(access["exp"] - access["iat"], 24 * 60 * 60)
		self.assertEqual(refresh["exp"] - refresh["iat"], 7 * 24 * 60 * 60)

	def test_refresh_endpoint_returns_a_new_access_token(self):
		refresh = str(RefreshToken.for_user(self.user))

		response = self.client.post(
			reverse("token-refresh"),
			{"refresh": refresh},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn("access", response.data)
