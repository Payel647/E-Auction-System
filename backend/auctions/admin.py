from django.contrib import admin

from .models import Auction, Bid


@admin.register(Auction)
class AuctionAdmin(admin.ModelAdmin):

    list_display = (
        "auction_code",
        "title",
        "category",
        "starting_price",
        "current_highest_bid",
        "seller",
        "status",
        "start_time",
        "end_time",
    )

    list_filter = (
        "category",
        "status",
    )

    search_fields = (
        "auction_code",
        "title",
    )


@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):

    list_display = (
        "auction",
        "bidder",
        "amount",
        "created_at",
    )

    list_filter = (
        "created_at",
    )

    search_fields = (
        "auction__auction_code",
        "bidder__email",
    )