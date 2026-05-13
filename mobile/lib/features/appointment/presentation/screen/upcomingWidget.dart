import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile/features/appointment/presentation/widget/appointment_card.dart';

import 'package:mobile/riverpod/appointment/appointment_provider.dart';

class UpcomingAppointmentsWidget extends ConsumerWidget {
  const UpcomingAppointmentsWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appointmentProvider);
    print(state.isLoading);

    print(state.error);

    print(state.appointments.length);
    // 🔥 Loading
    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    // 🔥 Error
    if (state.error != null) {
      return Center(child: Text(state.error!));
    }

    // 🔥 Today's date only
    final now = DateTime.now();

    final today = DateTime(now.year, now.month, now.day);

    // 🔥 Filter upcoming appointments
    final upcomingAppointments =
        state.appointments.where(
      (appointment) {

        final parsed =
            DateTime.parse(
          appointment.date??"dd-mm-yyyy",
        );

        final appointmentDate =
            DateTime(
          parsed.year,
          parsed.month,
          parsed.day,
        );

        return appointmentDate
                .isAtSameMomentAs(today)

            ||

            appointmentDate
                .isAfter(today);
      },
    ).toList(); 
    /* final upcomingAppointments = state.appointments;
    // 🔥 Empty state
    if (upcomingAppointments.isEmpty) {
      return const Center(child: Text("No upcoming appointments"));
    } */
    print(upcomingAppointments.length);
    print(state.appointments);
    // 🔥 Appointment list
    return ListView.builder(
      itemCount: upcomingAppointments.length,

      itemBuilder: (context, index) {
        final appointment = upcomingAppointments[index];

        return AppointmentCard(appointment: appointment);
      },
    );
  }
}
