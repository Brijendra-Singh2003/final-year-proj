import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/appointment/presentation/screen/book_appointment_screen.dart';
import 'package:mobile/features/appointment/presentation/widget/doctor_card.dart';
import 'package:mobile/riverpod/doctor_provider.dart';

import '../../data/models/doctor_model.dart';

class DoctorListScreen extends ConsumerStatefulWidget {
  final String? searchQuery;

  const DoctorListScreen({
    super.key,
    this.searchQuery,
  });

  @override
  ConsumerState<DoctorListScreen> createState() =>
      _DoctorListScreenState();
}

class _DoctorListScreenState
    extends ConsumerState<DoctorListScreen> {

  @override
  void initState() {
    super.initState();

    Future.microtask(() {
      ref.read(doctorProvider.notifier).fetchDoctors();
    });
  }

  @override
  Widget build(BuildContext context) {

    final doctorState = ref.watch(doctorProvider);

    // ✅ Loading
    if (doctorState.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    // ✅ Error
    if (doctorState.error != null) {
      return Scaffold(
        appBar: AppBar(
          title: Text(widget.searchQuery ?? "All Doctors"),
        ),
        body: Center(
          child: Text(doctorState.error!),
        ),
      );
    }

    // ✅ Filtering
final query =
    widget.searchQuery
        ?.toLowerCase() ?? "";

final filteredDoctors =
    doctorState.doctors.where((doctor) {

  final doctorName =
      doctor.name
          .toLowerCase();

  final doctorSpecialty =
      doctor.specialty
          .toLowerCase();

  return doctorName.contains(query) ||

      doctorSpecialty.contains(query);

}).toList();
//final filteredDoctors = doctorState.doctors;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.searchQuery ?? "All Doctors",
        ),
      ),

      body: filteredDoctors.isEmpty
          ? const Center(
              child: Text("No doctors available"),
            )
          : ListView.builder(
              itemCount: filteredDoctors.length,
              itemBuilder: (context, index) {

                final doctor = filteredDoctors[index];

                 return DoctorCard(
                  doctor: doctor,

                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => BookAppointmentScreen(
                          doctor: doctor,
                        ),
                      ),
                    );
                  },
                ); 
                //print("DOCTOR OBJECT: $doctor");

/* return ListTile(
  title: Text(doctor.name ?? "No Name"),
  subtitle: Text(doctor.specialty ?? "No Specialty"),
); */
              },
            ),
    );
  }
}