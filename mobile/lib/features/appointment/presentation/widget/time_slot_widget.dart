import 'package:flutter/material.dart';

class TimeSlotWidget extends StatelessWidget {
  final String? selectedTime;
  final Function(String) onTimeSelected;

  const TimeSlotWidget({
    super.key,
    required this.selectedTime,
    required this.onTimeSelected,
  });

  @override
  Widget build(BuildContext context) {
    const slots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

    return Wrap(
      spacing: 10,
      children: slots.map((time) {
        final isSelected = selectedTime == time;

        return ChoiceChip(
          label: Text(time),
          selected: isSelected,
          onSelected: (_) => onTimeSelected(time),
        );
      }).toList(),
    );
  }
}