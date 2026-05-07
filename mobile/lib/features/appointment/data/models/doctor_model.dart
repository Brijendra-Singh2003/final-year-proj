class DoctorModel {
  final int id;
  final String name;
  final String email;
  final String specialty;
  final String? phone;

  DoctorModel({
    required this.id,
    required this.name,
    required this.email,
    required this.specialty,
    this.phone,
  });

  factory DoctorModel.fromJson(Map<String, dynamic> json) {
    return DoctorModel(
      id: json["id"],
      name: json["name"],
      specialty: json["specialty"],
      email: json["email"],
      phone: json["phone"],
    );
  }
}