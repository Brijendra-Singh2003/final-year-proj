import 'package:flutter/material.dart';

class CategoryItemWidget extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onTap;
  const CategoryItemWidget({
    super.key,
    required this.label,
    required this.icon,
    required this.onTap,
    
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
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: Colors.blue),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }
}