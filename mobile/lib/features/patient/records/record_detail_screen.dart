/* import 'package:flutter/material.dart';

import 'package:mobile/core/theme/theme.dart';

class RecordDetailScreen
    extends StatelessWidget {

  final String doctorName;

  final String date;

  final String diagnosis;

  final String medicine;

  final String notes;

  const RecordDetailScreen({

    super.key,

    required this.doctorName,

    required this.date,

    required this.diagnosis,

    required this.medicine,

    required this.notes,
  });

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
          AppTheme.bgPrimary,

      appBar: AppBar(

        title:
            const Text("Medical Record"),
      ),

      body: Padding(

        padding:
            const EdgeInsets.all(20),

        child: Card(

          child: Padding(

            padding:
                const EdgeInsets.all(20),

            child: Column(

              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [

                // 👨‍⚕️ Doctor + Date
                Row(

                  children: [

                    Text(

                      doctorName,

                      style:
                          const TextStyle(

                        fontSize: 20,

                        fontWeight:
                            FontWeight.bold,

                        color: AppTheme
                            .textPrimary,
                      ),
                    ),

                    const SizedBox(
                      width: 8,
                    ),

                    Text(

                      "• $date",

                      style:
                          const TextStyle(

                        color: AppTheme
                            .textSecondary,

                        fontSize: 15,
                      ),
                    ),
                  ],
                ),

                const SizedBox(
                  height: 20,
                ),

                // 📝 Notes
                Text(

                  notes,

                  style:
                      const TextStyle(

                    fontSize: 17,

                    color: AppTheme
                        .textPrimary,
                  ),
                ),

                const SizedBox(
                  height: 24,
                ),

                // 🩺 Diagnosis
                RichText(

                  text: TextSpan(

                    children: [

                      const TextSpan(

                        text:
                            "Diagnosis: ",

                        style: TextStyle(

                          color: Colors.orange,

                          fontWeight:
                              FontWeight.bold,

                          fontSize: 18,
                        ),
                      ),

                      TextSpan(

                        text:
                            diagnosis,

                        style:
                            const TextStyle(

                          color: AppTheme
                              .textPrimary,

                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(
                  height: 24,
                ),

                // 💊 Medicine
                Row(

                  children: [

                    const Icon(

                      Icons.medication,

                      color: AppTheme
                          .primaryGreen,
                    ),

                    const SizedBox(
                      width: 10,
                    ),

                    Text(

                      medicine,

                      style:
                          const TextStyle(

                        fontSize: 18,

                        color: AppTheme
                            .textPrimary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
} */
import 'package:flutter/material.dart';

import 'package:mobile/core/theme/theme.dart';

class RecordDetailScreen
    extends StatelessWidget {

  final String doctorName;

  final String date;

  final String diagnosis;

  final String medicine;

  final String notes;

  const RecordDetailScreen({

    super.key,

    required this.doctorName,

    required this.date,

    required this.diagnosis,

    required this.medicine,

    required this.notes,
  });

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
          AppTheme.bgPrimary,

      appBar: AppBar(

        elevation: 0,

        backgroundColor:
            AppTheme.bgPrimary,

        title: const Text(
          "Medical Record",
        ),
      ),

      body: SingleChildScrollView(

        padding:
            const EdgeInsets.all(20),

        child: Card(

          elevation: 2,

          shape:
              RoundedRectangleBorder(

            borderRadius:
                BorderRadius.circular(
              20,
            ),
          ),

          child: Padding(

            padding:
                const EdgeInsets.all(24),

            child: Column(

              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [

                // 👨‍⚕️ Doctor + Date
                Row(

                  crossAxisAlignment:
                      CrossAxisAlignment
                          .start,

                  children: [

                    Expanded(

                      child: Column(

                        crossAxisAlignment:
                            CrossAxisAlignment
                                .start,

                        children: [

                          Text(

                            doctorName,

                            style:
                                const TextStyle(

                              fontSize: 22,

                              fontWeight:
                                  FontWeight.bold,

                              color: AppTheme
                                  .textPrimary,
                            ),
                          ),

                          const SizedBox(
                            height: 6,
                          ),

                          Text(

                            date
                                .split("T")[0],

                            style:
                                const TextStyle(

                              color: AppTheme
                                  .textSecondary,

                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(
                  height: 28,
                ),

                // 📝 Prescription / Notes
                Container(

                  width: double.infinity,

                  padding:
                      const EdgeInsets.all(
                    18,
                  ),

                  decoration: BoxDecoration(

                    color:
                        AppTheme.subtleGreen,

                    borderRadius:
                        BorderRadius.circular(
                      16,
                    ),
                  ),

                  child: Column(

                    crossAxisAlignment:
                        CrossAxisAlignment
                            .start,

                    children: [

                      const Row(

                        children: [

                          Icon(

                            Icons.description,

                            color: AppTheme
                                .primaryGreen,
                          ),

                          SizedBox(
                            width: 10,
                          ),

                          Text(

                            "Prescription Notes",

                            style:
                                TextStyle(

                              fontSize: 18,

                              fontWeight:
                                  FontWeight.bold,

                              color: AppTheme
                                  .textPrimary,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(
                        height: 14,
                      ),

                      Text(

                        notes,

                        style:
                            const TextStyle(

                          fontSize: 17,

                          height: 1.5,

                          color: AppTheme
                              .textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(
                  height: 28,
                ),

                // 🩺 Diagnosis
                Container(

                  width: double.infinity,

                  padding:
                      const EdgeInsets.all(
                    18,
                  ),

                  decoration: BoxDecoration(

                    color:
                        Colors.orange.shade50,

                    borderRadius:
                        BorderRadius.circular(
                      16,
                    ),
                  ),

                  child: Row(

                    crossAxisAlignment:
                        CrossAxisAlignment
                            .start,

                    children: [

                      const Icon(

                        Icons.medical_information,

                        color: Colors.orange,
                      ),

                      const SizedBox(
                        width: 12,
                      ),

                      Expanded(

                        child: RichText(

                          text: TextSpan(

                            children: [

                              const TextSpan(

                                text:
                                    "Diagnosis: ",

                                style:
                                    TextStyle(

                                  color:
                                      Colors.orange,

                                  fontWeight:
                                      FontWeight.bold,

                                  fontSize: 18,
                                ),
                              ),

                              TextSpan(

                                text:
                                    diagnosis,

                                style:
                                    const TextStyle(

                                  color: AppTheme
                                      .textPrimary,

                                  fontSize: 18,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(
                  height: 28,
                ),

                // 💊 Medicine
                Container(

                  width: double.infinity,

                  padding:
                      const EdgeInsets.all(
                    18,
                  ),

                  decoration: BoxDecoration(

                    color:
                        AppTheme.subtleGreen,

                    borderRadius:
                        BorderRadius.circular(
                      16,
                    ),
                  ),

                  child: Row(

                    children: [

                      const Icon(

                        Icons.medication,

                        size: 28,

                        color: AppTheme
                            .primaryGreen,
                      ),

                      const SizedBox(
                        width: 14,
                      ),

                      Expanded(

                        child: Text(

                          medicine,

                          style:
                              const TextStyle(

                            fontSize: 18,

                            fontWeight:
                                FontWeight.w600,

                            color: AppTheme
                                .textPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}