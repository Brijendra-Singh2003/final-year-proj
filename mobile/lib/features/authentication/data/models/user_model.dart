class UserModel {
  final int id;
  final String name;
  final String email;
  final String role;
  final String? specialty;
  final String? phone;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.specialty,
    this.phone,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json["id"],
      name: json["name"] ?? "",
      email: json["email"] ?? "",
      role: json["role"] ?? "",
      specialty: json["specialty"], // nullable
      phone: json["phone"],
    );
  }
}