from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    APPROVAL_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    approval_status = models.CharField(
        max_length=20,
        choices=APPROVAL_STATUS,
        default='pending'
    )

    def __str__(self):
        return self.username