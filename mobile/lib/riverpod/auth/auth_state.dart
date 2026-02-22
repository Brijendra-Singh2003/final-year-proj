class AuthState {
  final bool isLoading;
  final String? token;
  final String? error;

  AuthState({
    this.isLoading = false,
    this.token,
    this.error,
  });

  AuthState copyWith({
    bool? isLoading,
    String? token,
    String? error,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      token: token ?? this.token,
      error: error,
    );
  }
}