import 'package:flutter/material.dart';
import 'package:mobile/features/appointment/presentation/screen/doctor_list_screen.dart';
import 'category_item_widget.dart';

class CategoryGridWidget extends StatelessWidget {
  const CategoryGridWidget({super.key});

  @override
  Widget build(BuildContext context) {

    final categories = [
      {
        "label": "General",
        "value": "General Practitioner",
      },
      {
        "label": "Dental",
        "value": "Dentist",
      },
      {
        "label": "Ortho",
        "value": "Orthopedic Surgeon",
      },
      {
        "label": "Dermat",
        "value": "Dermatologist",
      },
      {
        "label": "Gynaec",
        "value": "Gynecologist",
      },
      {
        "label": "Pediatric",
        "value": "Pediatrician",
      },
      {
        "label": "Cardio",
        "value": "Cardiologist",
      },
      {
        "label": "Eye",
        "value": "Ophthalmologist",
      },
      {
        "label": "ENT",
        "value": "ENT Specialist",
      },
      {
        "label": "Psych",
        "value": "Psychiatrist",
      },
      {
        "label": "Nutrition",
        "value": "Nutritionist",
      },
      {
        "label": "Physio",
        "value": "Physiotherapist",
      },
      {
        "label": "Neuro",
        "value": "Neurologist",
      },
      {
        "label": "Urology",
        "value": "Urologist",
      },
      {
        "label": "Oncology",
        "value": "Oncologist",
      },
      {
        "label": "View All",
        "value": null,
      },
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

        final category = categories[index];

        return CategoryItemWidget(
          label: category["label"] as String,
          icon: Icons.medical_services,

          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => DoctorListScreen(
                  specialty: category["value"],
                ),
              ),
            );
          },
        );
      },
    );
  }
}