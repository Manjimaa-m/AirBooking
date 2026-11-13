from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_approval_email(user_email, username):

    subject = 'AirBooking - Account Approved'

    message = f"""
Hello {username},

Good news!

Your AirBooking account has been approved successfully.

You can now log in and book your flights.

Thank you for choosing AirBooking!

Regards,
AirBooking Team
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )

    return f"Approval email sent to {user_email}"