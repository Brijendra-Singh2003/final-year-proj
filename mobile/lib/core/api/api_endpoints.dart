class ApiEndpoints {
  static const String baseUrl =
      "https://patient-management-vku0.onrender.com";

  // ================= AUTH =================
  static const String login = "/auth/login";
  static const String signup = "/auth/register";

  // ================= USER =================
  static const String getProfile = "/users/me";

  // ================= DOCTORS =================
  static const String searchDoctors = "/patients/doctors/search";

  static String getDoctorById(int id) => "/doctors/$id";

  static String searchDoctorsBySpecialty(String specialty) =>
      "/doctors?specialty=$specialty";

  // ================= APPOINTMENTS =================
  static const String getAppointments = "/appointments";

  static const String bookAppointment = "/appointments";

  static String cancelAppointment(int id) =>
      "/appointments/$id";

  // ================= RECORDS =================
  static const String getRecords = "/records";
  static const String uploadRecord = "/records/upload";
}