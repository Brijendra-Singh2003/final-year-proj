import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:mobile/features/appointment/data/appointment_api.dart';
import 'package:mobile/features/appointment/data/models/appointment_model.dart';

import '../../core/api/appointment_api.dart';

/// 🔹 STATE
class AppointmentState {
  final List<AppointmentModel> appointments;
  final bool isLoading;
  final String? error;
  final bool isBooked;

  AppointmentState({
    this.appointments = const[],
    this.isLoading = false,
    this.error,
    this.isBooked = false,
  });

  AppointmentState copyWith({
    
    bool? isLoading,
    String? error,
    bool? isBooked,
    List<AppointmentModel>? appointments,
  }) {

    return AppointmentState(
      
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isBooked: isBooked ?? this.isBooked,
      appointments: appointments ?? this.appointments,
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
  Future<void> fetchAppointments() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final appointments = await _appointmentApi.fetchAppointments();

      state = state.copyWith(isLoading: false, appointments: appointments);
    } catch (e) {
      print("Provider error: $e");
      String message = e.toString();

      if (e is DioException) {
        message = e.response?.data["detail"] ?? e.message ?? "Network error";
      }

      state = state.copyWith(isLoading: false, error: message);
    }
  }
  Future<void> bookAppointment({
    required int doctorId,
    required String date,
    required String timeSlot,
    String notes="",
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