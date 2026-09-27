from django.utils import timezone
from .models import Auction


def update_auction_status(auction):
    now = timezone.now()

    # Auction has not started
    if now < auction.start_time:
        if auction.status != Auction.Status.UPCOMING:
            auction.status = Auction.Status.UPCOMING
            auction.save(
                update_fields=["status", "updated_at"]
            )

        return auction

    # Auction has ended
    if now >= auction.end_time:

        if auction.status not in [
            Auction.Status.CLOSED,
            Auction.Status.UNSOLD
        ]:
            highest_bid = auction.bids.order_by("-amount").first()

            if highest_bid:
                auction.status = Auction.Status.CLOSED
                auction.winner = highest_bid.bidder
                auction.current_highest_bid = highest_bid.amount
            else:
                auction.status = Auction.Status.UNSOLD
                auction.winner = None

            auction.save(
                update_fields=[
                    "status",
                    "winner",
                    "current_highest_bid",
                    "updated_at"
                ]
            )

        return auction

    # Auction is currently running
    if auction.status != Auction.Status.ACTIVE:
        auction.status = Auction.Status.ACTIVE

        auction.save(
            update_fields=["status", "updated_at"]
        )

    return auction


# Keep old function name working
def close_expired_auction(auction):
    return update_auction_status(auction)