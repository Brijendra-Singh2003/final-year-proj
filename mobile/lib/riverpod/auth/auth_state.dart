import 'package:mobile/features/authentication/data/models/user_model.dart';

class AuthState {
  final bool isLoading;
  final String? token;
  final String? error;
  final UserModel? user;

  AuthState({this.isLoading = false, this.token, this.error, this.user});
  bool get isAuthenticated => token != null;
  AuthState copyWith({
    bool? isLoading,
    String? token,
    String? error,
    UserModel? user,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      token: token ?? this.token,
      user: user ?? this.user,
      error: error,
    );
  }
}
