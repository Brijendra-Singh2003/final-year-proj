import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/appointment/data/models/doctor_model.dart';
import 'package:mobile/features/appointment/presentation/widget/booking_confirmation.dart';
import 'package:mobile/features/appointment/presentation/widget/date_selector_widget.dart';
import 'package:mobile/features/appointment/presentation/widget/time_slot_widget.dart';
import 'package:mobile/riverpod/appointment/appointment_provider.dart';

class BookAppointmentScreen extends ConsumerStatefulWidget {
  final DoctorModel doctor;

  const BookAppointmentScreen({super.key, required this.doctor});

  @override
  ConsumerState<BookAppointmentScreen> createState() =>
      _BookAppointmentScreenState();
}

class _BookAppointmentScreenState extends ConsumerState<BookAppointmentScreen> {
  DateTime? selectedDate;
  String? selectedTime;
  final TextEditingController notesController =
    TextEditingController();
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(appointmentProvider);

    return Scaffold(
      appBar: AppBar(title: Text(widget.doctor.name??"")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 👨‍⚕️ Doctor Info
            Text(
              widget.doctor.specialty??"",
              style: const TextStyle(fontSize: 16),
            ),

            const SizedBox(height: 20),

            // 📅 Date Selector
            DateSelectorWidget(
              onDateSelected: (date) {
                setState(() {
                  selectedDate = date;
                });
              },
            ),

            const SizedBox(height: 20),

            // ⏰ Time Slots
            TimeSlotWidget(
              selectedTime: selectedTime,
              onTimeSelected: (time) {
                setState(() {
                  selectedTime = time;
                });
              },
            ),

            const Spacer(),

            // ✅ Confirm Button
            ElevatedButton(
              /* onPressed: (selectedDate == null || selectedTime == null)
                  ? null
                  : () async {

  await ref
      .read(appointmentProvider.notifier)
      .bookAppointment(

        doctorId: doctor.id,

        date: selectedDate
            ?.toIso8601String()
            .split("T")[0],

        timeSlot: selectedTimeSlot,

        notes: notesController.text,
      );

  final appointmentState =
      ref.read(appointmentProvider);

  // ✅ Success
  if (appointmentState.isBooked) {

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          "Appointment booked successfully",
        ),
      ),
    );

    Navigator.pop(context);
  }

  // ❌ Error
  else if (appointmentState.error != null) {

    String message =
        appointmentState.error!;

    if (message.contains(
        "already booked")) {

      message =
          "This time slot is already booked.";
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
      ),
    );
  }
}, */
onPressed: (selectedDate == null || selectedTime == null)
    ? null
    : () async {

        await ref
            .read(appointmentProvider.notifier)
            .bookAppointment(

              doctorId: widget.doctor.id,

              date: selectedDate!
                  .toIso8601String()
                  .split("T")[0],

              timeSlot: selectedTime!,

              notes: notesController.text,
            );

        final appointmentState =
            ref.read(appointmentProvider);

        // ✅ Success
        if (appointmentState.isBooked) {

          ScaffoldMessenger.of(context)
              .showSnackBar(
            const SnackBar(
              content: Text(
                "Appointment booked successfully",
              ),
            ),
          );

          Navigator.pop(context);
        }

        // ❌ Error
        else if (appointmentState.error != null) {

          String message =
              appointmentState.error!;

          if (message.contains(
              "already booked")) {

            message =
                "This time slot is already booked.";
          }

          ScaffoldMessenger.of(context)
              .showSnackBar(
            SnackBar(
              content: Text(message),
            ),
          );
        }
      },
              child: state.isLoading
                  ? const CircularProgressIndicator()
                  : const Text("Confirm Booking"),
            ),
          ],
        ),
      ),
    );
  }
}
