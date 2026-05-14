

import 'package:mobile/features/patient/records/record_model.dart';

class RecordState {

  final bool isLoading;

  final List<RecordModel> records;

  final String? error;

  RecordState({

    this.isLoading = false,

    this.records = const [],

    this.error,
  });

  RecordState copyWith({

    bool? isLoading,

    List<RecordModel>? records,

    String? error,
  }) {

    return RecordState(

      isLoading:
          isLoading ?? this.isLoading,

      records:
          records ?? this.records,

      error:
          error,
    );
  }
}