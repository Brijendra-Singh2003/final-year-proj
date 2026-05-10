import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme.dart';

class AuthTextField extends StatefulWidget {

  final String hintText;
  final TextEditingController controller;
  final TextInputType type;
  final IconData icon;
  final ValueChanged<String?> onChanged;

  final bool isObscure;
  final bool isPassword;

  final FormFieldValidator? validator;

  const AuthTextField({
    super.key,
    required this.hintText,
    required this.controller,
    required this.type,
    required this.icon,
    required this.onChanged,
    this.isObscure = false,
    this.isPassword = false,
    this.validator,
  });

  @override
  State<AuthTextField> createState() =>
      _AuthTextFieldState();
}

class _AuthTextFieldState
    extends State<AuthTextField> {

  late bool _isObscure;

  @override
  void initState() {

    super.initState();

    _isObscure = widget.isPassword;
  }

  @override
  Widget build(BuildContext context) {

    final suffixIcon = widget.isPassword

        ? IconButton(

            icon: Icon(

              _isObscure

                  ? Icons.visibility_off

                  : Icons.visibility,

              color: AppTheme
                  .lightTheme()
                  .primaryColor,
            ),

            onPressed: () {

              setState(() {

                _isObscure =
                    !_isObscure;
              });
            },
          )

        : null;

    return SizedBox(

      width: double.infinity,

      child: TextFormField(

        validator: widget.validator,

        obscureText: _isObscure,

        controller: widget.controller,

        onChanged: widget.onChanged,

        keyboardType: widget.type,

        decoration: InputDecoration(

          prefixIcon: Icon(

            widget.icon,

            color: AppTheme
                .lightTheme()
                .primaryColor,
          ),

          suffixIcon: suffixIcon,

          hintText: widget.hintText,

          hintStyle: const TextStyle(
            fontSize: 15,
          ),

          contentPadding:
              const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 16,
          ),

          filled: true,

          fillColor: Colors.white,

          enabledBorder:
              OutlineInputBorder(

            borderRadius:
                BorderRadius.circular(12),

            borderSide: BorderSide(

              color: AppTheme
                  .lightTheme()
                  .primaryColor,
            ),
          ),

          focusedBorder:
              OutlineInputBorder(

            borderRadius:
                BorderRadius.circular(12),

            borderSide: BorderSide(

              color: AppTheme
                  .lightTheme()
                  .primaryColor,

              width: 2,
            ),
          ),
        ),
      ),
    );
  }
}