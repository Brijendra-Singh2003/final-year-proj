import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:mobile/features/authentication/data/auth_api.dart';
/* import '../../features/auth/data/auth_api.dart'; */
import '../../core/storage/secure_storage.dart';
import 'auth_state.dart';

class AuthController extends StateNotifier<AuthState> {
  final AuthApi _authApi;

  AuthController(this._authApi) : super(AuthState());

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final response = await _authApi.login(email, password);

      await SecureStorage.saveToken(response.token);

      state = state.copyWith(
        isLoading: false,
        token: response.token,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
  Future<void> signup(String email, String password) async {
  state = state.copyWith(isLoading: true, error: null);

  try {
    final response = await _authApi.signup(email, password);

    await SecureStorage.saveToken(response.token);

    state = state.copyWith(
      isLoading: false,
      token: response.token,
    );
  } catch (e) {
    state = state.copyWith(
      isLoading: false,
      error: e.toString(),
    );
  }
}

  Future<void> logout() async {
    await SecureStorage.deleteToken();
    state = AuthState();
  }
}