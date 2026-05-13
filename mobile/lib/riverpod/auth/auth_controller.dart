import 'package:flutter_riverpod/legacy.dart';
import 'package:mobile/features/authentication/data/auth_api.dart';
import 'package:mobile/features/authentication/data/user_api.dart';
import '../../core/storage/secure_storage.dart';
import 'auth_state.dart';
import 'package:dio/dio.dart';
class AuthController extends StateNotifier<AuthState> {
  final AuthApi _authApi;
final UserApi _userApi = UserApi();
  AuthController(this._authApi) : super(AuthState());
Future<void> fetchUserProfile() async {
  try {
    final user = await _userApi.getProfile();

    state = state.copyWith(user: user);
  } catch (e) {
    // optional: handle silently or log
  }
}
  Future<void> login(String email, String password) async {
    
    try {
      final response = await _authApi.login(email, password);
      await SecureStorage.saveToken(response.token);
      state = state.copyWith(
  isLoading: false,
  token: response.token,
  user: response.user, // already coming from login
);
    } catch (e) {
      String errorMessage = "An unexpected error occurred";
      if (e is DioException) {
        final data = e.response?.data;
        if (data is Map<String, dynamic>) {
          errorMessage = data['detail'].toString();
        }  else {
          errorMessage = data.toString();
        }
        if (e.response != null && e.response?.data != null) {
          errorMessage = e.response?.data['message'] ?? errorMessage;
        } else {
          errorMessage = e.message ?? errorMessage;
        }
      } else {
        errorMessage = e.toString();
      }
      state = state.copyWith(
        isLoading: false,
        error: errorMessage,
      );
    }
  }
  Future<void>checkAuth() async{
    final token = await SecureStorage.getToken();
    if(token != null){
      state = state.copyWith(token: token);
      await fetchUserProfile();
    }
  }
  Future<void> logout() async{
    await SecureStorage.deleteToken();
    state = AuthState();
  }
  Future<void> signup(
  String name,
  String email,
  String password,
  String phone,
) async {
  state = state.copyWith(isLoading: true, error: null);

  try {
    final user = await _authApi.signup(
      name: name,
      email: email,
      password: password,
      phone: phone,
    );

    state = state.copyWith(
      isLoading: false,
      user: user, // optional
    );

  } catch (e) {
    if (e is DioException) {
  print("SIGNUP ERROR RESPONSE: ${e.response?.data}");

  final message =
      e.response?.data["detail"]?.toString() ??
      e.response?.data.toString() ??
      "Signup failed";

  state = state.copyWith(
    isLoading: false,
    error: message,
  );
} else {
  state = state.copyWith(
    isLoading: false,
    error: e.toString(),
  );
}
  }
}

  
}