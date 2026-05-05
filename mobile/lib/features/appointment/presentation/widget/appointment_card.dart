import 'package:flutter/material.dart';
import '../../data/models/appointment_model.dart';

class AppointmentCard extends StatelessWidget {
  final AppointmentModel appointment;

  const AppointmentCard({super.key, required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(appointment.doctorName),
        subtitle: Text("${appointment.date} at ${appointment.time}"),
        trailing: Text(appointment.status),
      ),
    );
  }
}