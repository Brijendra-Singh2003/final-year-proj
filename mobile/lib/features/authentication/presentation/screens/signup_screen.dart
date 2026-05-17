import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/core/theme/theme.dart';
import 'package:mobile/features/authentication/presentation/widget/auth_text_field.dart';
import 'package:mobile/features/authentication/presentation/widget/customAppBar.dart';
import '../../../../riverpod/auth/auth_provider.dart';

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
      appBar: CustomAppBar(title: "Signup", color: Colors.white),
      body: Container(
        decoration: BoxDecoration(color: AppTheme.bgSecondary),
        width: double.infinity,
        height: double.infinity,
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.25),
                  AuthTextField(
                    hintText: "Name",
                    controller: nameController,
                    type: TextInputType.name,
                    icon: Icons.person,
                    onChanged: (value) {},
                  ),
                  const SizedBox(height: 10),
                  AuthTextField(
                    hintText: "Email",
                    controller: emailController,
                    type: TextInputType.emailAddress,
                    icon: Icons.email,
                    onChanged: (value) {},
                  ),
                  const SizedBox(height: 10),
                  AuthTextField(
                    hintText: "Password",
                    controller: passwordController,
                    type: TextInputType.visiblePassword,
                    icon: Icons.lock,
                    onChanged: (value) {},
                    isPassword: true,
                  ),
                  const SizedBox(height: 10),
                  AuthTextField(
                    hintText: "Phone Number",
                    controller: phoneNumberController,
                    type: TextInputType.phone,
                    icon: Icons.phone,
                    onChanged: (value) {},
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,

                    child: ElevatedButton(
                      onPressed: authState.isLoading
                          ? null
                          : () async {
                              final email = emailController.text.trim();

                              final password = passwordController.text.trim();

                              final name = nameController.text.trim();

                              final phone = phoneNumberController.text.trim();

                              await ref
                                  .read(authProvider.notifier)
                                  .signup(name, email, password, phone);

                              if (!context.mounted) return;

                              final state = ref.read(authProvider);

                              if (state.error == null) {
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => LoginScreen(),
                                  ),
                                );
                              } else {
                                _showErrorDialog(context, state.error!);
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
                              "Signup",

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
                            color: AppTheme.darkGreen,
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
          ),
        ),
      ),
    );
  }
}
