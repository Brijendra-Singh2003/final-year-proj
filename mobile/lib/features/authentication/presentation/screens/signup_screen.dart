import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/authentication/presentation/widget/auth_text_field.dart';
import '../../../../riverpod/auth/auth_provider.dart';
/* import '../widgets/auth_textfield.dart';
 */
import 'login_screen.dart';

class SignupScreen extends ConsumerWidget {
  SignupScreen({super.key});

  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final nameController = TextEditingController();
  final phoneNumberController = TextEditingController();
  void _showErrorDialog(BuildContext context, String error) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Signup Failed"),
        content: Text(error),
        actions: [
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
      appBar: AppBar(title: const Text("Signup")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            AuthTextField(hint: "Name", controller: nameController),
            const SizedBox(height: 10),
            AuthTextField(hint: "Email", controller: emailController),
            const SizedBox(height: 10),
            AuthTextField(
              hint: "Password",
              controller: passwordController,
              isPassword: true,
            ),
            const SizedBox(height: 10),
            AuthTextField(
              hint: "Phone Number",
              controller: phoneNumberController,
            ),
            const SizedBox(height: 20),

            ElevatedButton(
  onPressed: authState.isLoading 
      ? null 
      : () async {
          // 1. Extract values
          final email = emailController.text.trim();
          final password = passwordController.text.trim();
          final name = nameController.text.trim();
          final phone = phoneNumberController.text.trim();

          // 2. Perform the signup
          await ref.read(authProvider.notifier).signup(name, email, password, phone);

          // 3. Check if the widget is still in the tree before using context
          if (!context.mounted) return;

          // 4. Check the updated state
          final state = ref.read(authProvider);

          if (state.error == null) {
            // ✅ Success → navigate
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (_) => LoginScreen()),
            );
          } else {
            // ❌ Show error
            _showErrorDialog(context, state.error!);
          }
        },
  child: authState.isLoading
      ? const SizedBox(
          height: 20,
          width: 20,
          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
        )
      : const Text("Signup"),
),

            const SizedBox(height: 20),

            // 🔥 Already user? Login
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text("Already a user? "),
                GestureDetector(
                  onTap: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => LoginScreen()),
                    );
                  },
                  child: const Text(
                    "Login now",
                    style: TextStyle(
                      color: Colors.blue,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),

            if (authState.error != null)
              Padding(
                padding: const EdgeInsets.only(top: 10),
                child: Text(
                  authState.error!,
                  style: const TextStyle(color: Colors.red),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
