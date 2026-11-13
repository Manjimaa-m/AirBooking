from django.urls import path

from .views import (
    BookingListCreateView,
    BookingDetailView,
    PaymentSimulationView,
    DownloadTicketView,
    BookingCancellationView,
    AdminBookingStatisticsView,
    AdminBookingListView,
)


urlpatterns = [

    # Booking APIs
    path(
        '',
        BookingListCreateView.as_view(),
        name='booking-list-create'
    ),

    path(
        '<int:pk>/',
        BookingDetailView.as_view(),
        name='booking-detail'
    ),

    # Payment Simulation
    path(
        '<int:pk>/payment/',
        PaymentSimulationView.as_view(),
        name='payment-simulation'
    ),

    # Download E-Ticket
    path(
        '<int:pk>/ticket/',
        DownloadTicketView.as_view(),
        name='download-ticket'
    ),
    path(
        '<int:pk>/cancel/',
        BookingCancellationView.as_view(),
        name='booking-cancel'
    ),
    path(
        'admin/stats/',
        AdminBookingStatisticsView.as_view(),
        name='admin-booking-statistics'
    ),
    path(
        'admin/all/',
        AdminBookingListView.as_view(),
        name='admin-booking-list'
    ),

]
