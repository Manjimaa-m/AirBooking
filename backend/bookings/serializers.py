from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    flight_number = serializers.CharField(
        source='flight.flight_number',
        read_only=True
    )

    airline = serializers.CharField(
        source='flight.airline',
        read_only=True
    )

    departure_city = serializers.CharField(
        source='flight.departure_city',
        read_only=True
    )

    arrival_city = serializers.CharField(
        source='flight.arrival_city',
        read_only=True
    )

    departure_time = serializers.DateTimeField(
        source='flight.departure_time',
        read_only=True
    )

    arrival_time = serializers.DateTimeField(
        source='flight.arrival_time',
        read_only=True
    )

    flight_status = serializers.CharField(
        source='flight.status',
        read_only=True
    )

    class Meta:
        model = Booking

        fields = [
            'id',
            'booking_reference',
            'user',
            'flight',
            'flight_number',
            'airline',
            'departure_city',
            'arrival_city',
            'departure_time',
            'arrival_time',
            'flight_status',
            'number_of_seats',
            'total_price',
            'booking_status',
            'payment_status',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'booking_reference',
            'user',
            'total_price',
            'booking_status',
            'payment_status',
            'created_at',
        ]