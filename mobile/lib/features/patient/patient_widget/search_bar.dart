/* import 'package:flutter/material.dart';

class SearchBarWidget extends StatelessWidget {
  const SearchBarWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        hintText: "Search doctors, clinics, or symptoms...",
        prefixIcon: const Icon(Icons.search),
        suffixIcon: const Icon(Icons.filter_list),
        filled: true,
        fillColor: Colors.grey.shade200,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
} */
import 'package:flutter/material.dart';

import 'package:mobile/core/theme/theme.dart';

import 'package:mobile/features/appointment/presentation/screen/doctor_list_screen.dart';

class SearchBarWidget extends StatefulWidget {
  const SearchBarWidget({super.key});

  @override
  State<SearchBarWidget> createState() => _SearchBarWidgetState();
}

class _SearchBarWidgetState extends State<SearchBarWidget> {
  final TextEditingController _searchController = TextEditingController();

  final Map<String, String> specialties = {
    "general": "General Practitioner",

    "dentist": "Dentist",

    "dental": "Dentist",

    "ortho": "Orthopedic Surgeon",

    "orthopedic": "Orthopedic Surgeon",

    "dermat": "Dermatologist",

    "dermatologist": "Dermatologist",

    "gynaec": "Gynecologist",

    "gynecologist": "Gynecologist",

    "pediatric": "Pediatrician",

    "pediatrician": "Pediatrician",

    "cardio": "Cardiologist",

    "cardiologist": "Cardiologist",

    "eye": "Ophthalmologist",

    "ophthalmologist": "Ophthalmologist",

    "ent": "ENT Specialist",

    "psych": "Psychiatrist",

    "psychiatrist": "Psychiatrist",

    "nutrition": "Nutritionist",

    "nutritionist": "Nutritionist",

    "physio": "Physiotherapist",

    "physiotherapist": "Physiotherapist",

    "neuro": "Neurologist",

    "neurologist": "Neurologist",

    "urology": "Urologist",

    "urologist": "Urologist",

    "oncology": "Oncologist",

    "oncologist": "Oncologist",
  };

  void _handleSearch() {
    final input = _searchController.text.trim().toLowerCase();
    if (input.isEmpty) return;
    Navigator.push(context,MaterialPageRoute(builder: (context) => DoctorListScreen(searchQuery: input)));
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _searchController,

      onSubmitted: (_) => _handleSearch(),

      decoration: InputDecoration(
        hintText: "Search doctors or specialties...",

        hintStyle: const TextStyle(color: AppTheme.textMuted),

        prefixIcon: Icon(Icons.search, color: AppTheme.primaryGreen),

        suffixIcon: IconButton(
          onPressed: _handleSearch,

          icon: Icon(Icons.arrow_forward, color: AppTheme.primaryGreen),
        ),

        filled: true,

        fillColor: Colors.white,

        contentPadding: const EdgeInsets.symmetric(vertical: 16),

        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),

          borderSide: BorderSide.none,
        ),

        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),

          borderSide: BorderSide(color: AppTheme.border),
        ),

        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),

          borderSide: const BorderSide(color: AppTheme.primaryGreen, width: 2),
        ),
      ),
    );
  }
}
