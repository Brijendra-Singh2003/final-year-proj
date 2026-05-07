import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/appointment/data/models/doctor_model.dart';
import 'package:mobile/features/appointment/presentation/widget/booking_confirmation.dart';
import 'package:mobile/features/appointment/presentation/widget/date_selector_widget.dart';
import 'package:mobile/features/appointment/presentation/widget/time_slot_widget.dart';
import 'package:mobile/riverpod/appointment/appointmenr_provider.dart';

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
              onPressed: (selectedDate == null || selectedTime == null)
                  ? null
                  : () async {
                      final confirmed = await showDialog(
                        context: context,
                        builder: (_) => BookingConfirmationDialog(
                          doctorName: widget.doctor.name??"",
                          date: selectedDate!,
                          time: selectedTime!,
                        ),
                      );

                      if (confirmed == true) {
                        await ref
                            .read(appointmentProvider.notifier)
                            .bookAppointment(
                              doctorId: widget.doctor.id??0,
                              date: selectedDate.toString(),
                              time: selectedTime!,
                            );

                        Navigator.pop(context);
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
