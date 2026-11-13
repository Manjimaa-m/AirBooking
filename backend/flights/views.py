from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Flight
from .serializers import FlightSerializer
import requests


# User: Search Flights
class FlightListView(generics.ListAPIView):

    serializer_class = FlightSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        queryset = Flight.objects.all()

        departure_city = self.request.query_params.get('departure_city')
        arrival_city = self.request.query_params.get('arrival_city')
        departure_date = self.request.query_params.get('departure_date')
        passengers = self.request.query_params.get('passengers')

        if departure_city:
            queryset = queryset.filter(
                departure_city__icontains=departure_city
            )

        if arrival_city:
            queryset = queryset.filter(
                arrival_city__icontains=arrival_city
            )

        if departure_date:
            queryset = queryset.filter(
                departure_time__date=departure_date
            )

        if passengers:
            queryset = queryset.filter(
                available_seats__gte=passengers
            )

        return queryset


# User: View Flight Details
class FlightDetailView(generics.RetrieveAPIView):

    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]


# Admin: View All Flights
class AdminFlightListView(generics.ListAPIView):

    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUser]


# Admin: Update Flight Status
class FlightStatusUpdateView(APIView):

    permission_classes = [IsAdminUser]

    def put(self, request, pk):

        try:
            flight = Flight.objects.get(pk=pk)

        except Flight.DoesNotExist:
            return Response(
                {'error': 'Flight not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get('status')

        valid_statuses = [
            choice[0] for choice in Flight.FLIGHT_STATUS
        ]

        if new_status not in valid_statuses:
            return Response(
                {
                    'error': 'Invalid flight status.',
                    'valid_statuses': valid_statuses
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        flight.status = new_status
        flight.save(update_fields=['status'])

        return Response(
            {
                'message': 'Flight status updated successfully.',
                'flight_number': flight.flight_number,
                'status': flight.status
            },
            status=status.HTTP_200_OK
        )

class LiveFlightStatusView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        url = "https://opensky-network.org/api/states/all"

        try:
            response = requests.get(
                url,
                timeout=20
            )

            response.raise_for_status()

            data = response.json()

            states = data.get('states') or []

            flights = []

            for state in states[:50]:

                flights.append({
                    'icao24': state[0],
                    'callsign': (state[1] or '').strip(),
                    'origin_country': state[2],
                    'longitude': state[5],
                    'latitude': state[6],
                    'altitude': state[7],
                    'velocity': state[9],
                    'heading': state[10],
                    'on_ground': state[8],
                })

            return Response({
                'source': 'OpenSky Network',
                'total_aircraft': len(states),
                'aircraft': flights
            })

        except requests.RequestException:
            return Response(
                {'error': 'Unable to fetch live flight data.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )