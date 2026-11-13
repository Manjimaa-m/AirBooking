from django.db import models


class Flight(models.Model):

    FLIGHT_STATUS = [
        ('on_time', 'On Time'),
        ('delayed', 'Delayed'),
        ('cancelled', 'Cancelled'),
    ]

    flight_number = models.CharField(
        max_length=20,
        unique=True
    )

    airline = models.CharField(max_length=100)

    departure_city = models.CharField(max_length=100)
    departure_airport = models.CharField(max_length=10)

    arrival_city = models.CharField(max_length=100)
    arrival_airport = models.CharField(max_length=10)

    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_seats = models.PositiveIntegerField()
    available_seats = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=FLIGHT_STATUS,
        default='on_time'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.flight_number} - {self.departure_city} to {self.arrival_city}"