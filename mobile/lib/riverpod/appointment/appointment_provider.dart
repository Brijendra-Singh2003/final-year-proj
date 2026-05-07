import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';

import '../../core/api/appointment_api.dart';

/// 🔹 STATE
class AppointmentState {

  final bool isLoading;
  final String? error;
  final bool isBooked;

  AppointmentState({
    this.isLoading = false,
    this.error,
    this.isBooked = false,
  });

  AppointmentState copyWith({
    bool? isLoading,
    String? error,
    bool? isBooked,
  }) {

    return AppointmentState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isBooked: isBooked ?? this.isBooked,
    );
  }
}

/// 🔹 CONTROLLER
class AppointmentController
    extends StateNotifier<AppointmentState> {

  AppointmentController()
      : super(AppointmentState());

  final AppointmentApi _appointmentApi =
      AppointmentApi();

  Future<void> bookAppointment({
    required int doctorId,
    required String date,
    required String timeSlot,
    required String notes,
  }) async {

    state = state.copyWith(
      isLoading: true,
      error: null,
      isBooked: false,
    );

    try {

      await _appointmentApi.bookAppointment(
        doctorId: doctorId,
        date: date,
        timeSlot: timeSlot,
        notes: notes,
      );

      state = state.copyWith(
        isLoading: false,
        isBooked: true,
      );

    } catch (e) {

      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}

/// 🔹 PROVIDER
final appointmentProvider =
    StateNotifierProvider<
        AppointmentController,
        AppointmentState>(
  (ref) => AppointmentController(),
);