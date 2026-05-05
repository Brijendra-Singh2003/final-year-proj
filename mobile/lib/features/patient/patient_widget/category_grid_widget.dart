import 'package:flutter/material.dart';
import 'category_item_widget.dart';

class CategoryGridWidget extends StatelessWidget {
  const CategoryGridWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = [
      "General", "Dental", "Ortho", "Dermat",
      "Gynaec", "Pediatric", "Cardio", "Eye",
      "ENT", "Psych", "Nutrition", "Physio",
      "Neuro", "Urology", "Oncology", "View All"
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: categories.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 0.8,
      ),
      itemBuilder: (context, index) {
        return CategoryItemWidget(
          label: categories[index],
          icon: Icons.medical_services,
        );
      },
    );
  }
}