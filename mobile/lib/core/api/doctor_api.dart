import 'package:mobile/features/appointment/data/models/doctor_model.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';


class DoctorApi {
  final ApiClient _client = ApiClient();

  Future<List<DoctorModel>> getDoctors() async {
    final response = await _client.dio.get(
      ApiEndpoints.searchDoctors,
    );

    print("DOCTORS RESPONSE: ${response.data}");

    return (response.data as List)
        .map((json) => DoctorModel.fromJson(json))
        .toList();
  }
}