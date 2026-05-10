import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget
    implements PreferredSizeWidget {
  final String title;
  final Color color;

  const CustomAppBar({
    required this.title,
    required this.color,
    super.key,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: color,
      centerTitle: true,
      title: Text(
        title,
        style: const TextStyle(
          color: Colors.blueAccent,
          fontWeight: FontWeight.bold
        ),
      ),
    );
  }
}