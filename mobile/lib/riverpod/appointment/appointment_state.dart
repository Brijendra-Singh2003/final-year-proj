import '../../features/appointment/data/models/appointment_model.dart';
import '../../features/appointment/data/models/doctor_model.dart';

class AppointmentState {
  final bool isLoading;
  final List<DoctorModel> doctors;
  final List<AppointmentModel> appointments;
  final String? error;

  AppointmentState({
    this.isLoading = false,
    this.doctors = const [],
    this.appointments = const [],
    this.error,
  });

  AppointmentState copyWith({
    bool? isLoading,
    List<DoctorModel>? doctors,
    List<AppointmentModel>? appointments,
    String? error,
  }) {
    return AppointmentState(
      isLoading: isLoading ?? this.isLoading,
      doctors: doctors ?? this.doctors,
      appointments: appointments ?? this.appointments,
      error: error,
    );
  }
}