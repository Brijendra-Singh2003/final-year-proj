import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import 'models/appointment_model.dart';
import 'models/doctor_model.dart';

class AppointmentApi {
  final ApiClient _client = ApiClient();

  Future<List<DoctorModel>> getDoctors() async {
    final response = await _client.dio.get(ApiEndpoints.getDoctors);

    return (response.data as List)
        .map((e) => DoctorModel.fromJson(e))
        .toList();
  }

  Future<List<AppointmentModel>> getAppointments() async {
    final response = await _client.dio.get(ApiEndpoints.getAppointments);

    return (response.data as List)
        .map((e) => AppointmentModel.fromJson(e))
        .toList();
  }

  Future<void> bookAppointment({
    required int doctorId,
    required String date,
    required String time,
  }) async {
    await _client.dio.post(
      ApiEndpoints.bookAppointment,
      data: {
        "doctor_id": doctorId,
        "date": date,
        "time": time,
      },
    );
  }
}