/* import 'package:flutter/material.dart';
import 'package:mobile/core/theme/theme.dart';
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
                        : i,
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
} */
import 'package:flutter/material.dart';

import 'package:mobile/core/theme/theme.dart';

import '../../data/models/appointment_model.dart';

class AppointmentCard
    extends StatelessWidget {

  final AppointmentModel
      appointment;

  const AppointmentCard({

    super.key,

    required this.appointment,
  });

  @override
  Widget build(BuildContext context) {

    final status =
        appointment.status
                ?.toLowerCase() ??
            "";

    final bool isCompleted =
        status == "completed";

    final bool isPending =
        status == "pending";

    final bool isCancelled =
        status == "cancelled";

    Color statusBgColor =
        AppTheme.subtleGreen;

    Color statusTextColor =
        AppTheme.primaryGreen;

    if (isCompleted) {

      statusBgColor =
          Colors.grey.shade200;

      statusTextColor =
          Colors.grey.shade700;
    }

    if (isCancelled) {

      statusBgColor =
          Colors.red.shade100;

      statusTextColor =
          Colors.red.shade700;
    }

    return Card(

      margin:
          const EdgeInsets.symmetric(
        horizontal: 14,
        vertical: 8,
      ),

      child: Padding(

        padding:
            const EdgeInsets.all(16),

        child: Row(

          children: [

            // 👨‍⚕️ Icon
            CircleAvatar(

              radius: 28,

              backgroundColor:
                  isCompleted
                      ? Colors.grey.shade200
                      : AppTheme.subtleGreen,

              child: Icon(

                Icons.medical_services,

                size: 28,

                color:
                    isCompleted
                        ? Colors.grey
                        : AppTheme
                            .primaryGreen,
              ),
            ),

            const SizedBox(width: 16),

            // 📄 Info
            Expanded(

              child: Column(

                crossAxisAlignment:
                    CrossAxisAlignment
                        .start,

                children: [

                  // 👨‍⚕️ Doctor Name
                  Text(

                    appointment
                            .doctorName ??
                        "Doctor",

                    style:
                        const TextStyle(

                      fontSize: 17,

                      fontWeight:
                          FontWeight.bold,

                      color: AppTheme
                          .textPrimary,
                    ),
                  ),

                  const SizedBox(
                    height: 10,
                  ),

                  // 📅 Date
                  Row(

                    children: [

                      Icon(

                        Icons
                            .calendar_today,

                        size: 16,

                        color: AppTheme
                            .textMuted,
                      ),

                      const SizedBox(
                        width: 6,
                      ),

                      Text(

                        appointment.date ??
                            "dd-mm-yyyy",

                        style:
                            const TextStyle(

                          color: AppTheme
                              .textSecondary,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(
                    height: 6,
                  ),

                  // ⏰ Time
                  Row(

                    children: [

                      Icon(

                        Icons.access_time,

                        size: 16,

                        color: AppTheme
                            .textMuted,
                      ),

                      const SizedBox(
                        width: 6,
                      ),

                      Text(

                        appointment.time ??
                            "hh:mm",

                        style:
                            const TextStyle(

                          color: AppTheme
                              .textSecondary,
                        ),
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
                horizontal: 12,
                vertical: 7,
              ),

              decoration: BoxDecoration(

                color:
                    statusBgColor,

                borderRadius:
                    BorderRadius.circular(
                  20,
                ),
              ),

              child: Text(

                appointment.status ??
                    "Status",

                style: TextStyle(

                  fontWeight:
                      FontWeight.w600,

                  color:
                      statusTextColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}