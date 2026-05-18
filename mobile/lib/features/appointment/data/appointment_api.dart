/* import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import 'models/appointment_model.dart';
import 'models/doctor_model.dart';

class AppointmentApi {
  final ApiClient _client = ApiClient();

  Future<List<DoctorModel>> searchDoctors() async {
    final response = await _client.dio.get(ApiEndpoints.searchDoctors);

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
    required String timeSlot,
    String notes = "",
  }) async {
    await _client.dio.post(
      ApiEndpoints.bookAppointment,
      data: {
        "doctor_id": doctorId,
        "date": date,
        "time_slot": timeSlot,
    
      },
    );
  }
} */
import 'package:mobile/core/api/api_client.dart';
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
    print(response.data);
    print(response.statusCode);
    final data = response.data as List;

    /* return data.map((json) => AppointmentModel.fromJson(json)).toList(); */
    for (final item in data) {

  print(item);
}

return data
    .map(
      (json) {

        print("PARSING");

        return AppointmentModel
            .fromJson(json);
      },
    )
    .toList();
  }
  Future<void> cancelAppointment(
  int appointmentId,
) async {

  await _client.dio.patch(
    "/patients/appointments/$appointmentId/cancel",
  );
}
}