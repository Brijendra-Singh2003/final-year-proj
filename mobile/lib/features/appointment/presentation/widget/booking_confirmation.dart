import 'package:flutter/material.dart';

class BookingConfirmationDialog extends StatelessWidget {
  final String doctorName;
  final DateTime date;
  final String time;

   const BookingConfirmationDialog({
    super.key,
    required this.doctorName,
    required this.date,
    required this.time,
  });

  @override

  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Confirm Appointment"),
      content: Text(
        "Doctor: $doctorName\nDate: ${date.toLocal().toString().split(' ')[0]}\nTime: $time",
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context, false),
          child: const Text("Cancel"),
        ),
        ElevatedButton(
          onPressed: () => Navigator.pop(context, true),
          child: const Text("Confirm"),
        ),
      ],
    );
  }
}