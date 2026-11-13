from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    PendingUsersView,
    ApproveUserView,
    RejectUserView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),

    path('login/', LoginView.as_view(), name='login'),

    path(
        'token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    # Admin APIs
    path(
        'admin/users/pending/',
        PendingUsersView.as_view(),
        name='pending_users'
    ),

    path(
        'admin/users/<int:pk>/approve/',
        ApproveUserView.as_view(),
        name='approve_user'
    ),

    path(
        'admin/users/<int:pk>/reject/',
        RejectUserView.as_view(),
        name='reject_user'
    ),
]