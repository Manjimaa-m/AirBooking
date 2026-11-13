"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from accounts.views import (
    PendingUsersView,
    ApproveUserView,
    RejectUserView,
)

from flights.views import (
    AdminFlightListView,
    FlightStatusUpdateView,
)

from bookings.views import AdminBookingStatisticsView


urlpatterns = [

    # Django Admin
    path('admin/', admin.site.urls),

    # Authentication APIs
    path('api/auth/', include('accounts.urls')),

    # Flight APIs
    path('api/flights/', include('flights.urls')),

    # Booking APIs
    path('api/bookings/', include('bookings.urls')),

    # Admin User Management APIs
    path(
        'api/admin/users/pending/',
        PendingUsersView.as_view(),
        name='admin-pending-users'
    ),

    path(
        'api/admin/users/<int:pk>/approve/',
        ApproveUserView.as_view(),
        name='admin-approve-user'
    ),

    path(
        'api/admin/users/<int:pk>/reject/',
        RejectUserView.as_view(),
        name='admin-reject-user'
    ),

    # Admin Flight Management APIs
    path(
        'api/admin/flights/',
        AdminFlightListView.as_view(),
        name='admin-flight-list'
    ),

    path(
        'api/admin/flights/<int:pk>/status/',
        FlightStatusUpdateView.as_view(),
        name='admin-flight-status'
    ),

    # Admin Booking Statistics API
    path(
        'api/admin/bookings/statistics/',
        AdminBookingStatisticsView.as_view(),
        name='admin-booking-statistics'
    ),

]
