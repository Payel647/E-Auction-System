from django.urls import path

from .views import (
    AuctionListCreateView,
    AuctionDetailView,
    PlaceBidView,
    BidHistoryView,
    AuctionResultView,
    AdminDeleteAuctionView,
    AdminStatisticsView,
    AdminUserListView,
    AdminDeleteUserView,
    MyBidsView,
)

urlpatterns = [
    path("", AuctionListCreateView.as_view(), name="auction-list"),

    # Admin routes MUST come before <int:id>/ routes
    path(
        "admin/statistics/",
        AdminStatisticsView.as_view(),
        name="admin-statistics"
    ),

    path(
        "admin/users/",
        AdminUserListView.as_view(),
        name="admin-users"
    ),

    path(
        "admin/users/<int:id>/delete/",
        AdminDeleteUserView.as_view(),
        name="admin-delete-user"
    ),

    path(
        "my-bids/",
        MyBidsView.as_view(),
        name="my-bids"
    ),

    path(
        "<int:id>/delete/",
        AdminDeleteAuctionView.as_view(),
        name="admin-delete-auction"
    ),

    path(
        "<int:id>/",
        AuctionDetailView.as_view(),
        name="auction-detail"
    ),

    path(
        "<int:id>/bid/",
        PlaceBidView.as_view(),
        name="place-bid"
    ),

    path(
        "<int:id>/bids/",
        BidHistoryView.as_view(),
        name="bid-history"
    ),

    path(
        "<int:id>/result/",
        AuctionResultView.as_view(),
        name="auction-result"
    ),
]