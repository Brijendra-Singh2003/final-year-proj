import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart' show StateNotifierProvider;
import 'package:mobile/features/authentication/data/auth_api.dart';
/* import '../../features/auth/data/auth_api.dart'; */
import 'auth_controller.dart';
import 'auth_state.dart';

final authApiProvider = Provider<AuthApi>((ref) {
  return AuthApi();
});

final authProvider =
    StateNotifierProvider<AuthController, AuthState>((ref) {
  final api = ref.read(authApiProvider);
  return AuthController(api);
});