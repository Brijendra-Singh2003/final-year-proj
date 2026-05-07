import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
//import 'package:mobile/features/appointment/presentation/screen/book_appointment_screen.dart';
import 'package:mobile/features/appointment/presentation/widget/appointment_card.dart';
import 'package:mobile/riverpod/appointment/appointmenr_provider.dart';

class AppointmentsScreen extends ConsumerWidget {
  const AppointmentsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appointmentProvider);

    return Scaffold(
      appBar: AppBar(title: const Text("Appointments")),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: state.appointments.length,
              itemBuilder: (context, index) {
                return AppointmentCard(appointment: state.appointments[index]);
              },
            ),
    );
  }
}
