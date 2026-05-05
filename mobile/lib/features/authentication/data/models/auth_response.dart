import 'package:mobile/features/authentication/data/models/user_model.dart';

class AuthResponse {
  final String token;
  final UserModel user;
  final String message;

  AuthResponse({
    required this.token,
    required this.user,
    required this.message,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json["token"] ?? "",
      user: UserModel.fromJson(json["user"]),
      message: json["message"] ?? "",
    );
  }
}