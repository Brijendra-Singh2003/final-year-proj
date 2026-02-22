import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/authentication/presentation/screens/signup_screen.dart';
import 'package:mobile/features/authentication/presentation/widget/auth_text_field.dart';
import 'package:mobile/features/patient/presentation/patient_dashboard_screen.dart';
import '../../../../riverpod/auth/auth_provider.dart';
/* import '../widgets/auth_textfield.dart'; */

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
      appBar: AppBar(title: const Text("Login")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            AuthTextField(hint: "Email", controller: emailController),
            const SizedBox(height: 10),
            AuthTextField(
              hint: "Password",
              controller: passwordController,
              isPassword: true,
            ),
            const SizedBox(height: 20),

            ElevatedButton(
              onPressed:authState.isLoading ? null : () {
                ref.read(authProvider.notifier).login(
                      emailController.text,
                      passwordController.text,
                    );
                    final updatedState = ref.read(authProvider);
                    if (updatedState.token != null) {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const PatientDashboardScreen(),
                        ),
                      );
                    }
                      if (updatedState.error != null) {
            _showErrorDialog(context, updatedState.error!);
          }
        
              },
              child: authState.isLoading
                  ? const CircularProgressIndicator()
                  : const Text("Login"),
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
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            if (authState.error != null)
              Text(authState.error!, style: const TextStyle(color: Colors.red)),
          ],
        ),
      ),
    );
  }
}
