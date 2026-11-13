from rest_framework import serializers
from .models import Flight


class FlightSerializer(serializers.ModelSerializer):

    class Meta:
        model = Flight

        fields = [
            'id',
            'flight_number',
            'airline',
            'departure_city',
            'departure_airport',
            'arrival_city',
            'arrival_airport',
            'departure_time',
            'arrival_time',
            'price',
            'total_seats',
            'available_seats',
            'status',
            'created_at',
        ]

        read_only_fields = ['id', 'created_at']