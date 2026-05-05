import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import '../../features/appointment/data/appointment_api.dart';
import 'appointment_controller.dart';
import 'appointment_state.dart';

final appointmentApiProvider = Provider<AppointmentApi>((ref) {
  return AppointmentApi();
});

final appointmentProvider =
    StateNotifierProvider<AppointmentController, AppointmentState>((ref) {
  final api = ref.read(appointmentApiProvider);
  return AppointmentController(api);
});