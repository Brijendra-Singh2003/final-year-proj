import 'package:flutter/material.dart';
import 'package:mobile/features/patient/patient_widget/banner.dart';
import 'package:mobile/features/patient/patient_widget/category_grid_widget.dart';
import 'package:mobile/features/patient/patient_widget/search_bar.dart';

class PatientDashboardScreen extends StatelessWidget {
  const PatientDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Home"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: const [
            SearchBarWidget(),
            SizedBox(height: 16),
            BannerWidget(),
            SizedBox(height: 20),
            CategoryGridWidget(),
          ],
        ),
      ),
    );
  }
}