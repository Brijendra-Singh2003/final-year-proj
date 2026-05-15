class RecordModel {
  final int id;

  final String summary;

  final String createdAt;
  final List reports;
  final List testResultFiles;

  RecordModel({
    required this.id,

    required this.summary,

    required this.createdAt,
    required this.reports,
    required this.testResultFiles,
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

    );
  }
}
