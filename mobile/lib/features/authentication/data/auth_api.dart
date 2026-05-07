import 'package:mobile/features/authentication/data/models/auth_response.dart';
import 'package:mobile/features/authentication/data/models/user_model.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_endpoints.dart';
import 'package:mobile/features/authentication/data/models/auth_response.dart';
/* import 'models/auth_response_model.dart'; */

class AuthApi {
  final ApiClient _client = ApiClient();

  Future<AuthResponse> login(
  String email,
  String password,
) async {

  try {

    print("LOGIN REQUEST STARTED");

    final response = await _client.dio.post(
      "/auth/login",
      data: {
        "email": email,
        "password": password,
      },
    );

    print("FULL LOGIN RESPONSE: ${response.data}");

    return AuthResponse.fromJson(response.data);

  } catch (e) {

    print("LOGIN API ERROR: $e");

    rethrow;
  }
}

  Future<UserModel> signup({
  required String name,
  required String email,
  required String password,
  required String phone,
}) async {

  // 🔥 PRINT REQUEST (VERY IMPORTANT)
  print("SIGNUP REQUEST DATA: ${{
    "name": name,
    "email": email,
    "password": password,
    "role": "patient",
    "specialty": "",
    "phone": phone,
  }}");

  final response = await _client.dio.post(
    "/auth/register",
    data: {
      "name": name,
      "email": email,
      "password": password,
      "role": "patient",
      "specialty": "",
      "phone": phone,
    },
  );

  // 🔥 PRINT RESPONSE
  print("FULL SIGNUP RESPONSE: ${response.data}");

  return UserModel.fromJson(response.data);
}
}
