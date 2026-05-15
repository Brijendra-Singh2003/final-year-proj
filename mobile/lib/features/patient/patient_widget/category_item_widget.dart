import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme.dart';
class CategoryItemWidget extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onTap;
  final Color backgroundColor;

final Color iconColor;

final Color textColor;
  const CategoryItemWidget({
    super.key,
    required this.label,
    required this.icon,
    required this.onTap,
    required this.backgroundColor,
    required this.iconColor ,
    required this.textColor,
    
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Column(
        children: [
          Container(
            height: 60,
            width: 60,
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: iconColor),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12, color: textColor),
          ),
        ],
      ),
    );
  }
}