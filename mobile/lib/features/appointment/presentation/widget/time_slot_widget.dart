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
    final slots = [
      "10:00",
      "11:00",
      "12:00",
      "14:00",
      "15:00",
      "16:00"
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