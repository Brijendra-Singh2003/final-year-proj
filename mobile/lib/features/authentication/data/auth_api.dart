import 'package:dio/dio.dart';
import 'package:mobile/features/authentication/data/models/auth_response.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
/* import 'models/auth_response_model.dart'; */

class AuthApi {
  final ApiClient _client = ApiClient();

  Future<AuthResponse> login(String email, String password) async {
    final response = await _client.dio.post(
      ApiEndpoints.login,
      data: {
        "email": email,
        "password": password,
      },
    );

    return AuthResponse.fromJson(response.data);
  }
  Future<AuthResponse> signup(
  String email,
  String password,
) async {
  final response = await _client.dio.post(
    "/auth/signup",
    data: {
      "email": email,
      "password": password,
    },
  );

  return AuthResponse.fromJson(response.data);
}
}