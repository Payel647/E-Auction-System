from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Auction, Bid
from .serializers import AuctionSerializer, BidSerializer, MyBidSerializer
from .permissions import IsSeller,IsAdmin
from .services import close_expired_auction
from accounts.models import User
from accounts.models import User
# AUCTION LIST + CREATE

class AuctionListCreateView(generics.ListCreateAPIView):
    serializer_class = AuctionSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsSeller()]

        return [IsAuthenticated()]

    def get_queryset(self):
        auctions = Auction.objects.all()

        if self.request.query_params.get("mine") == "true":
            auctions = auctions.filter(seller=self.request.user)

        return auctions.order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

# AUCTION DETAILS

class AuctionDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, id):

        try:
            auction = Auction.objects.get(id=id)

        except Auction.DoesNotExist:
            return Response(
                {
                    "error": "Auction not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Automatically close if expired
        auction = close_expired_auction(auction)

        return Response(
            AuctionSerializer(auction).data
        )


class AdminDeleteAuctionView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, id):
        try:
            auction = Auction.objects.get(id=id)
        except Auction.DoesNotExist:
            return Response(
                {"error": "Auction not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        auction.delete()

        return Response(
            {"message": "Auction deleted successfully."},
            status=status.HTTP_200_OK
        )

class AdminStatisticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        total_auctions = Auction.objects.count()

        active_auctions = Auction.objects.filter(
            status=Auction.Status.ACTIVE
        ).count()

        closed_auctions = Auction.objects.filter(
            status=Auction.Status.CLOSED
        ).count()

        total_bids = Bid.objects.count()

        total_users = request.user.__class__.objects.count()

        return Response({
            "total_users": total_users,
            "total_auctions": total_auctions,
            "active_auctions": active_auctions,
            "closed_auctions": closed_auctions,
            "total_bids": total_bids,
            "current_admin_id": request.user.id,
        })


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = User.objects.all().order_by("-date_joined")

        data = []

        for user in users:
            data.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "date_joined": user.date_joined.isoformat(),
            })

        return Response(data)


class AdminDeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.id == request.user.id:
            return Response(
                {"error": "You cannot delete your own admin account."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()

        return Response(
            {"message": "User deleted successfully."},
            status=status.HTTP_200_OK
        )
# AUCTION RESULT

class AuctionResultView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, id):

        try:
            auction = Auction.objects.get(id=id)

        except Auction.DoesNotExist:
            return Response(
                {
                    "error": "Auction not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Check expiry
        auction = close_expired_auction(auction)

        return Response({
            "auction_code": auction.auction_code,
            "title": auction.title,
            "status": auction.status,
            "starting_price": auction.starting_price,
            "final_price": auction.current_highest_bid,
            "winner": (
                auction.winner.name
                if auction.winner
                else None
            ),
            "end_time": auction.end_time,
        })

# PLACE BID

class PlaceBidView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, id):

        # Buyers and sellers can bid, but administrators cannot.
        if request.user.role not in [User.Role.BUYER, User.Role.SELLER]:
            return Response(
                {
                    "error": "Only buyers and sellers can place bids."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Validate bid amount
        try:
            amount = Decimal(
                str(request.data.get("amount"))
            )

        except (TypeError, ValueError):
            return Response(
                {
                    "error": "Invalid bid amount."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent zero/negative bids
        if amount <= 0:
            return Response(
                {
                    "error": "Bid amount must be greater than 0."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Lock auction row while placing bid
        with transaction.atomic():

            try:
                auction = Auction.objects.select_for_update().get(
                    id=id
                )

            except Auction.DoesNotExist:
                return Response(
                    {
                        "error": "Auction not found."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            if auction.seller_id == request.user.id:
                return Response(
                    {
                        "error": "Seller cannot bid on own auction."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            now = timezone.now()

            # Check auction timing

            if now < auction.start_time:

                auction.status = Auction.Status.UPCOMING

                auction.save(
                    update_fields=[
                        "status",
                        "updated_at"
                    ]
                )

                return Response(
                    {
                        "error": "Auction has not started yet."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if now >= auction.end_time:

                # Close expired auction properly
                close_expired_auction(auction)

                return Response(
                    {
                        "error": "Auction has already ended."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Auction is currently active
            auction.status = Auction.Status.ACTIVE

            auction.save(
                update_fields=[
                    "status",
                    "updated_at"
                ]
            )

            highest_bid = auction.bids.order_by(
                "-amount",
                "-created_at"
            ).first()
            if highest_bid and highest_bid.bidder_id == request.user.id:
                return Response(
                    {
                        "error": "You are already the highest bidder."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Minimum bid

            minimum_bid = max(
                auction.starting_price,
                auction.current_highest_bid
            ) + Decimal("1.00")

            if amount < minimum_bid:
                return Response(
                    {
                        "error": (
                            f"Bid must be at least "
                            f"₹{minimum_bid}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Create bid

            bid = Bid.objects.create(
                auction=auction,
                bidder=request.user,
                amount=amount
            )

            # Update highest bid
            auction.current_highest_bid = amount

            auction.save(
                update_fields=[
                    "current_highest_bid",
                    "updated_at"
                ]
            )

        return Response(
            BidSerializer(bid).data,
            status=status.HTTP_201_CREATED
        )

# BID HISTORY

class BidHistoryView(generics.ListAPIView):

    serializer_class = BidSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        auction_id = self.kwargs["id"]

        return Bid.objects.filter(
            auction_id=auction_id
        ).order_by("created_at")


class MyBidsView(generics.ListAPIView):
    serializer_class = MyBidSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role not in [User.Role.BUYER, User.Role.SELLER]:
            return Bid.objects.none()

        return Bid.objects.filter(
            bidder=self.request.user
        ).select_related("auction").order_by("-created_at")