import 'package:flutter_riverpod/legacy.dart';
import '../../features/appointment/data/appointment_api.dart';
import 'appointment_state.dart';
import 'package:dio/dio.dart';
class AppointmentController extends StateNotifier<AppointmentState> {
  final AppointmentApi _api;

  AppointmentController(this._api) : super(AppointmentState());

  Future<void> fetchDoctors() async {
    state = state.copyWith(isLoading: true);

    try {
      final doctors = await _api.getDoctors();
      state = state.copyWith(isLoading: false, doctors: doctors);
    } catch (e) {
  String message = "Something went wrong";

  if (e is DioException) {
    message = e.response?.data["detail"] ??
              e.message ??
              "Network error";
  }

  state = state.copyWith(
    isLoading: false,
    error: message,
  );
}
  }

  Future<void> fetchAppointments() async {
    state = state.copyWith(isLoading: true);

    try {
      final appointments = await _api.getAppointments();
      state =
          state.copyWith(isLoading: false, appointments: appointments);
    } catch (e) {
  String message = "Something went wrong";

  if (e is DioException) {
    message = e.response?.data["detail"] ??
              e.message ??
              "Network error";
  }

  state = state.copyWith(
    isLoading: false,
    error: message,
  );
}
  }

  Future<void> bookAppointment({
    required int doctorId,
    required String date,
    required String time,
  }) async {
    state = state.copyWith(isLoading: true);

    try {
      await _api.bookAppointment(
        doctorId: doctorId,
        date: date,
        time: time,
      );

      await fetchAppointments(); // refresh list
    } catch (e) {
  String message = "Something went wrong";

  if (e is DioException) {
    message = e.response?.data["detail"] ??
              e.message ??
              "Network error";
  }

  state = state.copyWith(
    isLoading: false,
    error: message,
  );
}
  }
}