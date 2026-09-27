from rest_framework import serializers
from .models import Auction,Bid

class AuctionSerializer(serializers.ModelSerializer):

    seller_name = serializers.CharField(
        source="seller.name",
        read_only=True
    )
    winner_name = serializers.CharField(
    source="winner.name",
    read_only=True,
    allow_null=True
   )
    class Meta:
        model = Auction

        fields = [
            "id",
            "auction_code",
            "title",
            "description",
            "category",
            "starting_price",
            "current_highest_bid",
            "seller",
            "seller_name",
            "start_time",
            "end_time",
            "status",
            "created_at",
            "updated_at",
            "winner",
            "winner_name",
        ]

        read_only_fields = [
            "id",
            "auction_code",
            "current_highest_bid",
            "seller",
            "status",
            "created_at",
            "updated_at",
            "winner",
        ]
class BidSerializer(serializers.ModelSerializer):

    bidder_name = serializers.CharField(
        source="bidder.name",
        read_only=True
    )

    class Meta:
        model = Bid

        fields = [
            "id",
            "auction",
            "bidder",
            "bidder_name",
            "amount",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "auction",
            "bidder",
            "created_at",
        ]


class MyBidSerializer(serializers.ModelSerializer):
    auction_code = serializers.CharField(
        source="auction.auction_code",
        read_only=True
    )
    auction_title = serializers.CharField(
        source="auction.title",
        read_only=True
    )
    auction_status = serializers.CharField(
        source="auction.status",
        read_only=True
    )
    current_highest_bid = serializers.DecimalField(
        source="auction.current_highest_bid",
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Bid
        fields = [
            "id",
            "auction",
            "auction_code",
            "auction_title",
            "auction_status",
            "current_highest_bid",
            "amount",
            "created_at",
        ]