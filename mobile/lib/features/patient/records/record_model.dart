class RecordModel {

  final int id;

  final String title;

  final String createdAt;

  RecordModel({

    required this.id,

    required this.title,

    required this.createdAt,
  });

  factory RecordModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return RecordModel(

      id: json["id"] ?? 0,

      title:
          json["title"] ?? "",

      createdAt:
          json["created_at"] ?? "",
    );
  }
}