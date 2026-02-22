import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/authentication/presentation/widget/auth_text_field.dart';
import '../../../../riverpod/auth/auth_provider.dart';
/* import '../widgets/auth_textfield.dart';
 */import 'login_screen.dart';

class SignupScreen extends ConsumerWidget {
  SignupScreen({super.key});

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(title: const Text("Signup")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            AuthTextField(
              hint: "Email",
              controller: emailController,
            ),
            const SizedBox(height: 10),
            AuthTextField(
              hint: "Password",
              controller: passwordController,
              isPassword: true,
            ),
            const SizedBox(height: 20),

            ElevatedButton(
              onPressed: () {
                ref.read(authProvider.notifier).signup(
                      emailController.text,
                      passwordController.text,
                    );
              },
              child: authState.isLoading
                  ? const CircularProgressIndicator()
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
                      MaterialPageRoute(
                        builder: (_) => LoginScreen(),
                      ),
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