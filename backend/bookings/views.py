from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404

from .models import Booking
from .serializers import BookingSerializer
from flights.models import Flight
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum


class BookingListCreateView(generics.ListCreateAPIView):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):

        flight_id = self.request.data.get('flight')
        number_of_seats = self.request.data.get('number_of_seats', 1)

        try:
            number_of_seats = int(number_of_seats)
        except (TypeError, ValueError):
            raise serializers.ValidationError(
                {'number_of_seats': 'Enter a valid number.'}
            )

        if number_of_seats < 1:
            raise serializers.ValidationError(
                {'number_of_seats': 'At least one seat is required.'}
            )

        with transaction.atomic():

            flight = get_object_or_404(
                Flight.objects.select_for_update(),
                id=flight_id
            )

            if flight.status == 'cancelled':
                raise serializers.ValidationError(
                    {'flight': 'This flight is cancelled.'}
                )

            if flight.available_seats < number_of_seats:
                raise serializers.ValidationError(
                    {'seats': 'Not enough seats available.'}
                )

            total_price = flight.price * number_of_seats

            flight.available_seats -= number_of_seats
            flight.save(update_fields=['available_seats'])

            serializer.save(
                user=self.request.user,
                flight=flight,
                total_price=total_price,
                booking_reference=uuid.uuid4().hex[:10].upper()
            )


class BookingDetailView(generics.RetrieveAPIView):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

class PaymentSimulationView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        booking = get_object_or_404(
            Booking,
            pk=pk,
            user=request.user
        )

        if booking.booking_status == 'cancelled':
            return Response(
                {'error': 'Cancelled booking cannot be paid.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.payment_status == 'paid':
            return Response(
                {'message': 'Payment already completed.'},
                status=status.HTTP_200_OK
            )

        booking.payment_status = 'paid'
        booking.booking_status = 'confirmed'

        booking.save(
            update_fields=['payment_status', 'booking_status']
        )

        return Response({
            'message': 'Payment successful!',
            'booking_reference': booking.booking_reference,
            'payment_status': booking.payment_status,
            'booking_status': booking.booking_status
        })

class DownloadTicketView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        booking = get_object_or_404(
            Booking,
            pk=pk,
            user=request.user
        )

        if booking.booking_status != 'confirmed':
            return Response(
                {'error': 'Ticket available only for confirmed bookings.'},
                status=400
            )

        response = HttpResponse(content_type='application/pdf')

        response['Content-Disposition'] = (
            f'attachment; filename="ticket_{booking.booking_reference}.pdf"'
        )

        pdf = canvas.Canvas(response, pagesize=A4)

        width, height = A4

        pdf.setTitle('AirBooking E-Ticket')

        pdf.setFont('Helvetica-Bold', 24)
        pdf.drawString(50, height - 60, 'AIRBOOKING')

        pdf.setFont('Helvetica-Bold', 18)
        pdf.drawString(50, height - 110, 'FLIGHT E-TICKET')

        pdf.line(50, height - 125, width - 50, height - 125)

        details = [
            ('Booking Reference', booking.booking_reference),
            ('Passenger', booking.user.get_full_name() or booking.user.username),
            ('Flight Number', booking.flight.flight_number),
            ('Airline', booking.flight.airline),
            ('From', booking.flight.departure_city),
            ('To', booking.flight.arrival_city),
            ('Departure', booking.flight.departure_time.strftime('%d-%m-%Y %I:%M %p')),
            ('Arrival', booking.flight.arrival_time.strftime('%d-%m-%Y %I:%M %p')),
            ('Seats', str(booking.number_of_seats)),
            ('Total Amount', f'INR {booking.total_price}'),
            ('Payment Status', booking.payment_status.upper()),
            ('Booking Status', booking.booking_status.upper()),
            ('Flight Status', booking.flight.status.upper()),
        ]

        y = height - 165

        for label, value in details:

            pdf.setFont('Helvetica-Bold', 11)
            pdf.drawString(60, y, f'{label}:')

            pdf.setFont('Helvetica', 11)
            pdf.drawString(220, y, str(value))

            y -= 32

        pdf.line(50, y, width - 50, y)

        pdf.setFont('Helvetica-Oblique', 10)
        pdf.drawString(50, y - 35, 'Thank you for choosing AirBooking!')

        pdf.save()

        return response

# Admin: Booking Statistics
class AdminBookingStatisticsView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):

        total_bookings = Booking.objects.count()

        confirmed_bookings = Booking.objects.filter(
            booking_status='confirmed'
        ).count()

        pending_bookings = Booking.objects.filter(
            booking_status='pending'
        ).count()

        cancelled_bookings = Booking.objects.filter(
            booking_status='cancelled'
        ).count()

        paid_bookings = Booking.objects.filter(
            payment_status='paid'
        ).count()

        total_revenue = Booking.objects.filter(
            payment_status='paid'
        ).aggregate(
            total=Sum('total_price')
        )['total'] or 0

        return Response({

            'total_bookings': total_bookings,

            'confirmed_bookings': confirmed_bookings,

            'pending_bookings': pending_bookings,

            'cancelled_bookings': cancelled_bookings,

            'paid_bookings': paid_bookings,

            'total_revenue': total_revenue,

        })

# Admin: View All Bookings
class AdminBookingListView(generics.ListAPIView):

    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Booking.objects.select_related(
            'user',
            'flight'
        ).all().order_by('-created_at')

class BookingCancellationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            with transaction.atomic():

                booking = Booking.objects.select_for_update().get(
                    pk=pk,
                    user=request.user
                )

                if booking.booking_status == 'cancelled':
                    return Response(
                        {"detail": "This booking is already cancelled."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if booking.booking_status != 'confirmed':
                    return Response(
                        {"detail": "Only confirmed bookings can be cancelled."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                flight = Flight.objects.select_for_update().get(
                    pk=booking.flight_id
                )

                flight.available_seats = min(
                    flight.total_seats,
                    flight.available_seats + booking.number_of_seats
                )

                flight.save(update_fields=['available_seats'])

                booking.booking_status = 'cancelled'
                booking.save(update_fields=['booking_status'])

                return Response({
                    "message": "Booking cancelled successfully.",
                    "booking_reference": booking.booking_reference,
                    "booking_status": booking.booking_status,
                    "payment_status": booking.payment_status,
                    "seats_restored": booking.number_of_seats,
                    "available_seats": flight.available_seats
                }, status=status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response(
                {"detail": "Booking not found."},
                status=status.HTTP_404_NOT_FOUND
            )