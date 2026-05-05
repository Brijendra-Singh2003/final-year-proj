import 'package:flutter/material.dart';

class DateSelectorWidget extends StatelessWidget {
  final Function(DateTime) onDateSelected;

  const DateSelectorWidget({super.key, required this.onDateSelected});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () async {
        final date = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime.now(),
          lastDate: DateTime(2100),
        );

        if (date != null) {
          onDateSelected(date);
        }
      },
      child: const Text("Select Date"),
    );
  }
}