import 'package:flutter_riverpod/legacy.dart';
import '../../features/appointment/data/appointment_api.dart';
import 'appointment_state.dart';
import 'package:dio/dio.dart';

class AppointmentController extends StateNotifier<AppointmentState> {
  final AppointmentApi _api;

  AppointmentController(this._api) : super(AppointmentState());

  /*  Future<void> fetchDoctors() async {
    state = state.copyWith(isLoading: true);

    try {
      final doctors = await _api.searchDoctors();
      state = state.copyWith(isLoading: false, doctors: doctors);
    } catch (e) {
      String message = "Something went wrong";

      if (e is DioException) {
        message = e.response?.data["detail"] ?? e.message ?? "Network error";
      }

      state = state.copyWith(isLoading: false, error: message);
    }
  } */

  Future<void> fetchAppointments() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final appointments = await _api.fetchAppointments();

      state = state.copyWith(isLoading: false, appointments: appointments);
    } catch (e) {
      String message = "Something went wrong";

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
  }) async {
    state = state.copyWith(isLoading: true);

    try {
      await _api.bookAppointment(
        doctorId: doctorId,
        date: date,
        timeSlot: timeSlot,
      );
      await fetchAppointments(); // refresh list
    } catch (e) {
      ///String message = "Something went wrong";
      print("Actual error: $e");
      String message = e.toString();
      if (e is DioException) {
        message = e.response?.data["detail"] ?? e.message ?? "Network error";
      }

      state = state.copyWith(isLoading: false, error: message);
    }
  }
  Future<void> cancelAppointment(
  int appointmentId,
) async {

  try {

    await _api.cancelAppointment(
      appointmentId,
    );

    await fetchAppointments();

  } catch (e) {

    state = state.copyWith(
      error: e.toString(),
    );
  }
}
}
