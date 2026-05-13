class AppointmentModel {
  final int? id;
  final String? doctorName;
  final String? specialty;
  final String? date;
  final String? time;
  final String? status;

  AppointmentModel({
    required this.id,
    required this.doctorName,
    required this.specialty,
    required this.date,
    required this.time,
    required this.status,
  });

  factory AppointmentModel.fromJson(Map<String, dynamic> json) {
    return AppointmentModel(
      id: json["id"]??"",
      doctorName: json["doctor"]?["name"]??"",
      specialty: json["specialty"]??"",
      date: json["date"]??"",
      time: json["time_slot"]??"",
      status: json["status"]??"",
    );
  }
}
