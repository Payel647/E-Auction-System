from django.db import models
from django.conf import settings
from django.utils import timezone


class Auction(models.Model):

    class Category(models.TextChoices):
        ELECTRONICS = "ELECTRONICS", "Electronics"
        COLLECTIBLES = "COLLECTIBLES", "Collectibles"
        BOOKS = "BOOKS", "Books"
        ART = "ART", "Art"
        GENERAL = "GENERAL", "General"

    class Status(models.TextChoices):
        UPCOMING = "UPCOMING", "Upcoming"
        ACTIVE = "ACTIVE", "Active"
        CLOSED = "CLOSED", "Closed"
        UNSOLD = "UNSOLD", "Unsold"

    auction_code = models.CharField(
        max_length=30,
        unique=True,
        editable=False
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(
        max_length=20,
        choices=Category.choices
    )

    starting_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    current_highest_bid = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="auctions"
    )

    start_time = models.DateTimeField()

    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.UPCOMING
    )
    winner = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="won_auctions"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if not self.auction_code:

            year = timezone.now().year

            last_auction = Auction.objects.order_by("-id").first()

            if last_auction:
                number = last_auction.id + 100
            else:
                number = 101

            self.auction_code = f"AUC-{year}-{number}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.auction_code} - {self.title}"
class Bid(models.Model):

    auction = models.ForeignKey(
        Auction,
        on_delete=models.CASCADE,
        related_name="bids"
    )

    bidder = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bids"
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.bidder.name} - "
            f"{self.auction.auction_code} - "
            f"{self.amount}"
        )