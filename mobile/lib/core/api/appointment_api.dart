/* import 'package:mobile/core/api/api_client.dart';
import 'package:mobile/features/appointment/data/models/appointment_model.dart';

class AppointmentApi {
  final ApiClient _client = ApiClient();

  Future<void> bookAppointment({
    required int doctorId,
    required String date,
    required String timeSlot,
    String notes = "",
  }) async {
    await _client.dio.post(
      "/patients/appointments",

      data: {
        "doctor_id": doctorId,
        "date": date,
        "time_slot": timeSlot,
        "notes": notes,
      },
    );
  }

  Future<List<AppointmentModel>> fetchAppointments() async {
    final response = await _client.dio.get("/patients/appointments");

    final data = response.data as List;

    return data.map((json) => AppointmentModel.fromJson(json)).toList();
  }
}
 */