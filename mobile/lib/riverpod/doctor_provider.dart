import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:mobile/core/api/doctor_api.dart';
import '../../features/appointment/data/models/doctor_model.dart';


/// 🔹 STATE
class DoctorState {
  final bool isLoading;
  final List<DoctorModel> doctors;
  final String? error;

  DoctorState({
    this.isLoading = false,
    this.doctors = const [],
    this.error,
  });

  DoctorState copyWith({
    bool? isLoading,
    List<DoctorModel>? doctors,
    String? error,
  }) {
    return DoctorState(
      isLoading: isLoading ?? this.isLoading,
      doctors: doctors ?? this.doctors,
      error: error,
    );
  }
}

/// 🔹 CONTROLLER
class DoctorController extends StateNotifier<DoctorState> {
  DoctorController() : super(DoctorState());

  final DoctorApi _doctorApi = DoctorApi();

  /// 🔥 Fetch all doctors
  Future<void> fetchDoctors() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final doctors = await _doctorApi.getDoctors();

      state = state.copyWith(
        isLoading: false,
        doctors: doctors,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}

/// 🔹 PROVIDER
final doctorProvider =
    StateNotifierProvider<DoctorController, DoctorState>(
  (ref) => DoctorController(),
);