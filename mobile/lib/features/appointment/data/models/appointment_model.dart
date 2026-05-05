class AppointmentModel {
  final int id;
  final String doctorName;
  final String date;
  final String time;
  final String status;

  AppointmentModel({
    required this.id,
    required this.doctorName,
    required this.date,
    required this.time,
    required this.status,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    return AppointmentModel(
      id: json["id"],
      doctorName: json["doctor_name"],
      date: json["date"],
      time: json["time"],
      status: json["status"],
    );
  }
}