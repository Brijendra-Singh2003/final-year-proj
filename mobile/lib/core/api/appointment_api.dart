import 'package:mobile/core/api/api_client.dart';

class AppointmentApi {

  final ApiClient _client = ApiClient();

  Future<void> bookAppointment({
    required int doctorId,
    required String date,
    required String timeSlot,
    required String notes,
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
}