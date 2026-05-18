import 'package:flutter/material.dart';

import 'package:mobile/core/theme/theme.dart';

import '../../data/models/appointment_model.dart';

class AppointmentCard
    extends StatelessWidget {

  final AppointmentModel
      appointment;

  final VoidCallback?
      onCancel;

  const AppointmentCard({

    super.key,

    required this.appointment,

    this.onCancel,
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

        child: Column(

          children: [

            Row(

              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [

                // 👨‍⚕️ Icon
                CircleAvatar(

                  radius: 28,

                  backgroundColor:
                      isCompleted
                          ? Colors.grey.shade200
                          : AppTheme
                              .subtleGreen,

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

                const SizedBox(
                  width: 16,
                ),

                // 📄 Appointment Info
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

                  decoration:
                      BoxDecoration(

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

            // ❌ Cancel Button
            if (isPending)

              Padding(

                padding:
                    const EdgeInsets.only(
                  top: 18,
                ),

                child:
                    Align(

                  alignment:
                      Alignment.centerRight,

                  child:
                      OutlinedButton.icon(

                    onPressed: () {

                      showDialog(

                        context: context,

                        builder:
                            (context) =>
                                AlertDialog(

                          title:
                              const Text(
                            "Cancel Appointment",
                          ),

                          content:
                              const Text(
                            "Are you sure you want to cancel this appointment?",
                          ),

                          actions: [

                            TextButton(

                              onPressed:
                                  () {

                                Navigator.pop(
                                  context,
                                );
                              },

                              child:
                                  const Text(
                                "No",
                              ),
                            ),

                            ElevatedButton(

                              onPressed:
                                  () {

                                Navigator.pop(
                                  context,
                                );

                                onCancel
                                    ?.call();
                              },

                              style:
                                  ElevatedButton.styleFrom(

                                backgroundColor:
                                    Colors.red,
                              ),

                              child:
                                  const Text(
                                "Yes",
                              ),
                            ),
                          ],
                        ),
                      );
                    },

                    icon: const Icon(
                      Icons.cancel_outlined,
                    ),

                    label: const Text(
                      "Cancel Appointment",
                    ),

                    style:
                        OutlinedButton.styleFrom(

                      foregroundColor:
                          Colors.red,

                      side:
                          const BorderSide(
                        color: Colors.red,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}