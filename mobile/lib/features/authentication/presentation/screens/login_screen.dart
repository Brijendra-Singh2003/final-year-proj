import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/theme/theme.dart';
import 'package:mobile/features/authentication/presentation/screens/signup_screen.dart';
import 'package:mobile/features/authentication/presentation/widget/auth_text_field.dart';
import 'package:mobile/features/authentication/presentation/widget/customAppBar.dart';
import 'package:mobile/features/patient/presentation/main_patient_screen.dart';

import '../../../../riverpod/auth/auth_provider.dart';

class LoginScreen extends ConsumerWidget {
  LoginScreen({super.key});

  final emailController = TextEditingController();

  final passwordController = TextEditingController();

  void _showErrorDialog(BuildContext context, String error) {
    bool isUserNotFound =
        error.toLowerCase().contains("not found") ||
        error.toLowerCase().contains("user does not exist");

    showDialog(
      context: context,

      builder: (context) => AlertDialog(
        title: const Text("Login Failed"),

        content: Text(
          isUserNotFound
              ? "User does not exist. Please create an account."
              : "Incorrect email or password.",
        ),

        actions: [
          if (isUserNotFound)
            TextButton(
              onPressed: () {
                Navigator.pop(context);

                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => SignupScreen()),
                );
              },

              child: const Text("Signup now"),
            ),

          TextButton(
            onPressed: () => Navigator.pop(context),

            child: const Text("OK"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: CustomAppBar(title: "Login", color: Colors.white),

      body: Container(
        decoration: BoxDecoration(color: AppTheme.bgSecondary),
        width: double.infinity,
        height: double.infinity,
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),

              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,

                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.25),

                  AuthTextField(
                    hintText: "Enter your email",

                    controller: emailController,

                    type: TextInputType.emailAddress,

                    icon: Icons.person_rounded,

                    onChanged: (value) {},
                  ),

                  const SizedBox(height: 16),

                  AuthTextField(
                    hintText: "Password",

                    controller: passwordController,

                    type: TextInputType.visiblePassword,

                    icon: Icons.lock_rounded,

                    onChanged: (value) {},

                    isPassword: true,
                  ),

                  const SizedBox(height: 30),

                  SizedBox(
                    width: double.infinity,

                    child: ElevatedButton(
                      onPressed: authState.isLoading
                          ? null
                          : () async {
                              final email = emailController.text.trim();

                              final password = passwordController.text.trim();

                              print("RAW EMAIL: '${emailController.text}'");

                              print(
                                "RAW PASSWORD: '${passwordController.text}'",
                              );

                              print("TRIMMED EMAIL: '$email'");

                              print("TRIMMED PASSWORD: '$password'");

                              await ref
                                  .read(authProvider.notifier)
                                  .login(email, password);

                              final updatedState = ref.read(authProvider);

                              print("TOKEN: ${updatedState.token}");

                              print("ERROR: ${updatedState.error}");

                              if (updatedState.token != null) {
                                Navigator.pushReplacement(
                                  context,

                                  MaterialPageRoute(
                                    builder: (_) => const MainScreen(initialIndex: 0),
                                  ),
                                );
                              } else if (updatedState.error != null) {
                                _showErrorDialog(context, updatedState.error!);
                              }
                            },

                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.lightTheme().primaryColor,

                        padding: const EdgeInsets.symmetric(vertical: 14),

                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),

                      child: authState.isLoading
                          ? const CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            )
                          : const Text(
                              "Login",

                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,

                    children: [
                      const Text("New user? "),

                      GestureDetector(
                        onTap: () {
                          Navigator.pushReplacement(
                            context,

                            MaterialPageRoute(builder: (_) => SignupScreen()),
                          );
                        },

                        child: const Text(
                          "Signup now",

                          style: TextStyle(
                            color: AppTheme.darkGreen,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  if (authState.error != null)
                    Text(
                      authState.error!,

                      style: const TextStyle(color: Colors.red),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
