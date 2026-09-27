from django.core.management.base import BaseCommand
from django.utils import timezone

from auctions.models import Auction
from auctions.services import update_auction_status


class Command(BaseCommand):
    help = "Automatically update auction statuses"

    def handle(self, *args, **kwargs):
        now = timezone.now()

        auctions = Auction.objects.filter(
            start_time__lte=now
        ).exclude(
            status__in=[
                Auction.Status.CLOSED,
                Auction.Status.UNSOLD
            ]
        )

        count = 0

        for auction in auctions:
            update_auction_status(auction)
            count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"{count} auction(s) processed."
            )
        )