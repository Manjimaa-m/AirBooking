from django.contrib import admin
from .models import Flight


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):

    list_display = (
        'flight_number',
        'airline',
        'departure_city',
        'arrival_city',
        'departure_time',
        'price',
        'available_seats',
        'status',
    )

    list_filter = (
        'status',
        'airline',
    )

    search_fields = (
        'flight_number',
        'departure_city',
        'arrival_city',
    )