import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme.dart';

class CustomAppBar extends StatelessWidget
    implements PreferredSizeWidget {
  final String title;
  final Color color;
final PreferredSizeWidget? bottom;
  const CustomAppBar({
    required this.title,
    required this.color,
    this.bottom,
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
          color: AppTheme.textPrimary,
          fontWeight: FontWeight.bold
        ),
      ),
    );
  }
}