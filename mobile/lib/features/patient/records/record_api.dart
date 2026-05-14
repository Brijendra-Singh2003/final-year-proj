import 'package:mobile/core/api/api_client.dart';

import 'record_model.dart';
class RecordApi {

  final ApiClient _client =
      ApiClient();

  Future<List<RecordModel>>
      fetchRecords() async {

    final response =
        await _client.dio.get(
      "/patients/records",
    );

    final data =
        response.data as List;

    return data
        .map(
          (json) =>
              RecordModel.fromJson(
            json,
          ),
        )
        .toList();
  }
}