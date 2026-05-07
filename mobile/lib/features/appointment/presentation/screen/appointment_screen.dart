import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mobile/riverpod/appointment/appointment_provider.dart';

class AppointmentsScreen extends ConsumerWidget {

  const AppointmentsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {

    final state = ref.watch(appointmentProvider);

    return Scaffold(

      appBar: AppBar(
        title: const Text("Appointments"),
      ),

      body: state.isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )

          : const Center(
              child: Text(
                "No appointments yet",
              ),
            ),
    );
  }
}