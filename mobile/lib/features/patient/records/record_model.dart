class RecordModel {
  final int id;

  final String?summary;

  final String createdAt;
  final List reports;
  final List testResultFiles;
  final String? doctorName;
  final String? diagnosis;
  final String? medicine;
  RecordModel({
    required this.id,
     this.summary,
    required this.createdAt,
    required this.reports,
    required this.testResultFiles,
     this.doctorName,
     this.diagnosis,
     this.medicine,
  });

  factory RecordModel.fromJson(Map<String, dynamic> json) {
    return RecordModel(
      id: json["id"] ?? 0,

      summary: json["summary"] ?? "",

      createdAt: json["created_at"] ?? "",
      reports:
          json["reports"] ?? [],

      testResultFiles:
          json["test_result_files"] ?? [],

      doctorName:
    json["reports"] != null &&
            json["reports"].isNotEmpty
        ? json["reports"][0]["doctor"]["name"]
        : null,

diagnosis:
    json["reports"] != null &&
            json["reports"].isNotEmpty
        ? json["reports"][0]["diagnosis"]
        : null,

medicine:
    json["reports"] != null &&
            json["reports"].isNotEmpty
        ? json["reports"][0]["prescription"]
        : null,
    );
  }
}
