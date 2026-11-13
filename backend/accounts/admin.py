from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        'username',
        'email',
        'approval_status',
        'is_active',
        'is_staff',
    )

    list_filter = (
        'approval_status',
        'is_active',
        'is_staff',
    )

    search_fields = (
        'username',
        'email',
    )

    fieldsets = UserAdmin.fieldsets + (
        ('Account Approval', {
            'fields': ('approval_status',),
        }),
    )