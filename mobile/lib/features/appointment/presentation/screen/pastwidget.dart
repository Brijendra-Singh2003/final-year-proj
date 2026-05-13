import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile/features/appointment/presentation/widget/appointment_card.dart';

import 'package:mobile/riverpod/appointment/appointment_provider.dart';

class PastAppointmentsWidget
    extends ConsumerWidget {

  const PastAppointmentsWidget({
    super.key,
  });

  @override
  Widget build(
    BuildContext context,
    WidgetRef ref,
  ) {

    final state =
        ref.watch(appointmentProvider);

    // 🔥 Loading
    if (state.isLoading) {

      return const Center(
        child:
            CircularProgressIndicator(),
      );
    }

    // 🔥 Error
    if (state.error != null) {

      return Center(
        child: Text(state.error!),
      );
    }

    // 🔥 Today's date only
    final now = DateTime.now();

    final today = DateTime(
      now.year,
      now.month,
      now.day,
    );

    // 🔥 Filter past appointments
    final pastAppointments =
        state.appointments.where(
      (appointment) {

        final parsed =
            DateTime.parse(
          appointment.date??"",
        );

        final appointmentDate =
            DateTime(
          parsed.year,
          parsed.month,
          parsed.day,
        );

        return appointmentDate
            .isBefore(today);
      },
    ).toList();

    // 🔥 Empty state
    if (pastAppointments.isEmpty) {

      return const Center(
        child: Text(
          "No past appointments",
        ),
      );
    }

    // 🔥 Appointment list
    return ListView.builder(

      itemCount:
          pastAppointments.length,

      itemBuilder: (context, index) {

        final appointment =
            pastAppointments[index];

        return AppointmentCard(
          appointment: appointment,
        );
      },
    );
  }
}