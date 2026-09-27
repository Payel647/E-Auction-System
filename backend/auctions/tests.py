from datetime import timedelta
from decimal import Decimal

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Auction, Bid


class MyBidsViewTests(APITestCase):
	def setUp(self):
		self.buyer = User.objects.create_user(
			email="buyer@example.com",
			password="password",
			name="Buyer",
			role=User.Role.BUYER,
		)
		self.other_buyer = User.objects.create_user(
			email="other@example.com",
			password="password",
			name="Other Buyer",
			role=User.Role.BUYER,
		)
		self.seller = User.objects.create_user(
			email="seller@example.com",
			password="password",
			name="Seller",
			role=User.Role.SELLER,
		)
		now = timezone.now()
		self.auction = Auction.objects.create(
			title="Vintage Camera",
			description="A classic camera.",
			category=Auction.Category.COLLECTIBLES,
			starting_price=Decimal("100.00"),
			seller=self.seller,
			start_time=now - timedelta(hours=1),
			end_time=now + timedelta(hours=1),
		)
		self.own_bid = Bid.objects.create(
			auction=self.auction,
			bidder=self.buyer,
			amount=Decimal("125.00"),
		)
		Bid.objects.create(
			auction=self.auction,
			bidder=self.other_buyer,
			amount=Decimal("150.00"),
		)

	def test_returns_only_authenticated_buyers_bids(self):
		self.client.force_authenticate(user=self.buyer)

		response = self.client.get(reverse("my-bids"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["id"], self.own_bid.id)
		self.assertEqual(response.data[0]["auction_title"], "Vintage Camera")
		self.assertEqual(response.data[0]["amount"], "125.00")

	def test_non_buyers_do_not_receive_bid_records(self):
		self.client.force_authenticate(user=self.seller)

		response = self.client.get(reverse("my-bids"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data, [])
