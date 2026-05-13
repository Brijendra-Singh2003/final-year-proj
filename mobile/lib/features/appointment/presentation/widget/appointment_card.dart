import 'package:flutter/material.dart';
import '../../data/models/appointment_model.dart';

class AppointmentCard extends StatelessWidget {

  final AppointmentModel appointment;

  const AppointmentCard({
    super.key,
    required this.appointment,
  });

  @override
  Widget build(BuildContext context) {

    final bool isCompleted = appointment.status?.toLowerCase() ==
            "completed";

    return Card(

      elevation: 3,

      margin: const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 8,
      ),

      shape: RoundedRectangleBorder(
        borderRadius:
            BorderRadius.circular(16),
      ),

      child: Padding(

        padding: const EdgeInsets.all(16),

        child: Row(

          children: [

            // 👨‍⚕️ Doctor Icon
            CircleAvatar(

              radius: 28,

              backgroundColor:
                  isCompleted

                      ? Colors.grey.shade300

                      : Colors.blue.shade100,

              child: Icon(

                Icons.medical_services,

                color:
                    isCompleted
                        ? Colors.grey
                        : Colors.blue,
              ),
            ),

            const SizedBox(width: 16),

            // 📄 Appointment Info
            Expanded(

              child: Column(

                crossAxisAlignment:
                    CrossAxisAlignment.start,

                children: [

                  // 👨‍⚕️ Doctor Name
                  Text(

                    appointment.doctorName??"Doctor name",

                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight:
                          FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 10),

                  // 📅 Date
                  Row(

                    children: [

                      const Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Colors.grey,
                      ),

                      const SizedBox(width: 6),

                      Text(
                        appointment.date??"dd-mm-yyyy",
                      ),
                    ],
                  ),

                  const SizedBox(height: 6),

                  // ⏰ Time
                  Row(

                    children: [

                      const Icon(
                        Icons.access_time,
                        size: 16,
                        color: Colors.grey,
                      ),

                      const SizedBox(width: 6),

                      Text(
                        appointment.time??"hh:mm",
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // 📌 Status
            Container(

              padding:
                  const EdgeInsets.symmetric(
                horizontal: 10,
                vertical: 6,
              ),

              decoration: BoxDecoration(

                color: isCompleted

                    ? Colors.grey.shade200

                    : Colors.green.shade100,

                borderRadius:
                    BorderRadius.circular(
                  20,
                ),
              ),

              child: Text(

                appointment.status??"Status",

                style: TextStyle(

                  fontWeight:
                      FontWeight.w600,

                  color: isCompleted
                      ? Colors.grey
                      : Colors.green,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}