import 'package:mobile/core/api/api_client.dart';
import 'package:mobile/core/api/api_endpoints.dart';
import 'package:mobile/features/authentication/data/models/user_model.dart';

class UserApi {
  final ApiClient _client = ApiClient();

  Future<UserModel> getProfile() async {
    final response = await _client.dio.get(ApiEndpoints.getProfile);

    return UserModel.fromJson(response.data);
  }
}