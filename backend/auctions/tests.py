from datetime import timedelta
from decimal import Decimal

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from .models import Auction, Bid


class AuctionListVisibilityTests(APITestCase):
	def setUp(self):
		self.buyer = User.objects.create_user(
			email="buyer@example.com",
			password="password",
			name="Buyer",
			role=User.Role.BUYER,
		)
		self.seller = User.objects.create_user(
			email="seller@example.com",
			password="password",
			name="Seller",
			role=User.Role.SELLER,
		)
		self.other_seller = User.objects.create_user(
			email="other-seller@example.com",
			password="password",
			name="Other Seller",
			role=User.Role.SELLER,
		)
		now = timezone.now()
		self.own_auction = Auction.objects.create(
			auction_code="TEST-OWN-1",
			title="Seller's Item",
			description="Owned by the signed-in seller.",
			category=Auction.Category.GENERAL,
			starting_price=Decimal("10.00"),
			seller=self.seller,
			start_time=now + timedelta(hours=1),
			end_time=now + timedelta(hours=2),
		)
		self.other_auction = Auction.objects.create(
			auction_code="TEST-OTHER-1",
			title="Other Seller's Item",
			description="Owned by another seller.",
			category=Auction.Category.GENERAL,
			starting_price=Decimal("20.00"),
			seller=self.other_seller,
			start_time=now + timedelta(hours=1),
			end_time=now + timedelta(hours=2),
		)

	def test_default_list_includes_all_auctions_for_seller(self):
		self.client.force_authenticate(user=self.seller)

		response = self.client.get(reverse("auction-list"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(
			{auction["id"] for auction in response.data},
			{self.own_auction.id, self.other_auction.id},
		)

	def test_mine_filter_returns_only_signed_in_sellers_auctions(self):
		self.client.force_authenticate(user=self.seller)

		response = self.client.get(reverse("auction-list"), {"mine": "true"})

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(
			[auction["id"] for auction in response.data],
			[self.own_auction.id],
		)


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
		self.other_seller = User.objects.create_user(
			email="other-seller@example.com",
			password="password",
			name="Other Seller",
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
		self.other_seller_auction = Auction.objects.create(
			title="Desk Lamp",
			description="A brass desk lamp.",
			category=Auction.Category.GENERAL,
			starting_price=Decimal("50.00"),
			seller=self.other_seller,
			start_time=now - timedelta(hours=1),
			end_time=now + timedelta(hours=1),
		)
		self.seller_bid = Bid.objects.create(
			auction=self.other_seller_auction,
			bidder=self.seller,
			amount=Decimal("55.00"),
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

	def test_sellers_receive_their_bid_records(self):
		self.client.force_authenticate(user=self.seller)

		response = self.client.get(reverse("my-bids"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["id"], self.seller_bid.id)
		self.assertEqual(response.data[0]["auction_title"], "Desk Lamp")


class SellerBidPermissionTests(APITestCase):
	def setUp(self):
		self.seller = User.objects.create_user(
			email="seller@example.com",
			password="password",
			name="Seller",
			role=User.Role.SELLER,
		)
		self.other_seller = User.objects.create_user(
			email="other-seller@example.com",
			password="password",
			name="Other Seller",
			role=User.Role.SELLER,
		)
		now = timezone.now()
		self.own_auction = Auction.objects.create(
			title="Seller's Item",
			description="Owned by the signed-in seller.",
			category=Auction.Category.GENERAL,
			starting_price=Decimal("10.00"),
			seller=self.seller,
			start_time=now - timedelta(hours=1),
			end_time=now + timedelta(hours=1),
		)
		self.other_auction = Auction.objects.create(
			title="Other Seller's Item",
			description="Owned by another seller.",
			category=Auction.Category.GENERAL,
			starting_price=Decimal("10.00"),
			seller=self.other_seller,
			start_time=now - timedelta(hours=1),
			end_time=now + timedelta(hours=1),
		)

	def test_seller_can_bid_on_another_sellers_auction(self):
		self.client.force_authenticate(user=self.seller)

		response = self.client.post(
			reverse("place-bid", args=[self.other_auction.id]),
			{"amount": "11.00"},
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(Bid.objects.get().bidder, self.seller)

	def test_seller_cannot_bid_on_own_auction(self):
		self.client.force_authenticate(user=self.seller)

		response = self.client.post(
			reverse("place-bid", args=[self.own_auction.id]),
			{"amount": "11.00"},
		)

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
		self.assertFalse(Bid.objects.exists())
