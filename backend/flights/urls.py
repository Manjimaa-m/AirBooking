from django.urls import path

from .views import (
    FlightListView,
    FlightDetailView,
    AdminFlightListView,
    FlightStatusUpdateView,
    LiveFlightStatusView,
)


urlpatterns = [

    # User APIs
    path(
        'search/',
        FlightListView.as_view(),
        name='flight-search'
    ),

    path(
        '<int:pk>/',
        FlightDetailView.as_view(),
        name='flight-detail'
    ),

    # Admin APIs
    path(
        'admin/',
        AdminFlightListView.as_view(),
        name='admin-flight-list'
    ),

    path(
        'admin/<int:pk>/status/',
        FlightStatusUpdateView.as_view(),
        name='flight-status-update'
    ),

    path(
        'live/',
        LiveFlightStatusView.as_view(),
        name='live-flight-status'
    ),

]