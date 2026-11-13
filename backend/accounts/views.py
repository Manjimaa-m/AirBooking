from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, LoginSerializer
from .tasks import send_approval_email

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


# Admin: View Pending Users
class PendingUsersView(generics.ListAPIView):

    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(approval_status='pending')

    def list(self, request, *args, **kwargs):
        users = self.get_queryset()

        data = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'approval_status': user.approval_status,
            }
            for user in users
        ]

        return Response(data)


# Admin: Approve User
class ApproveUserView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, pk):

        user = get_object_or_404(User, pk=pk)

        if user.approval_status == 'approved':
            return Response({
                'message': 'User is already approved.'
            }, status=status.HTTP_200_OK)

        user.approval_status = 'approved'
        user.save(update_fields=['approval_status'])

        # Send approval email using Celery
        send_approval_email.delay(
            user.email,
            user.username
        )

        return Response({
            'message': 'User approved successfully.',
            'email_status': 'Approval email task queued.',
            'user_id': user.id,
            'approval_status': user.approval_status
        })


# Admin: Reject User
class RejectUserView(APIView):

    permission_classes = [IsAdminUser]

    def post(self, request, pk):

        user = get_object_or_404(User, pk=pk)

        user.approval_status = 'rejected'
        user.save()

        return Response({
            'message': 'User rejected successfully.',
            'user_id': user.id,
            'approval_status': user.approval_status
        })
