class DoctorModel {
  final int id;
  final String name;
  final String specialization;
  final int experience;

  DoctorModel({
    required this.id,
    required this.name,
    required this.specialization,
    required this.experience,
  });

  factory DoctorModel.fromJson(Map<String, dynamic> json) {
    return DoctorModel(
      id: json["id"],
      name: json["name"],
      specialization: json["specialization"],
      experience: json["experience"],
    );
  }
}