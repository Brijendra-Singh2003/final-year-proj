import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/features/appointment/presentation/screen/book_appointment_screen.dart';
import 'package:mobile/features/appointment/presentation/widget/doctor_card.dart';
import 'package:mobile/riverpod/doctor_provider.dart';

import '../../data/models/doctor_model.dart';

class DoctorListScreen extends ConsumerStatefulWidget {
  final String? specialty;

  const DoctorListScreen({
    super.key,
    this.specialty,
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
          title: Text(widget.specialty ?? "All Doctors"),
        ),
        body: Center(
          child: Text(doctorState.error!),
        ),
      );
    }

    // ✅ Filtering
final filteredDoctors = widget.specialty == null
    ? doctorState.doctors
    : doctorState.doctors.where((doctor) {

        final doctorSpecialty =
            (doctor.specialty ?? "").trim().toLowerCase();

        final selectedSpecialty =
            (widget.specialty ?? "").trim().toLowerCase();

        /* print("DOCTOR: $doctorSpecialty");
        print("SELECTED: $selectedSpecialty"); */

        return doctorSpecialty == selectedSpecialty;

      }).toList();
//final filteredDoctors = doctorState.doctors;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.specialty ?? "All Doctors",
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