import 'package:flutter_riverpod/legacy.dart';

import 'package:dio/dio.dart';
import 'package:mobile/features/patient/records/record_api.dart';



import 'record_state.dart';

class RecordController
    extends StateNotifier<RecordState> {

  final RecordApi _api;

  RecordController(this._api)
      : super(RecordState());

  Future<void> fetchRecords() async {

    state = state.copyWith(

      isLoading: true,

      error: null,
    );

    try {

      final records =
          await _api.fetchRecords();

      state = state.copyWith(

        isLoading: false,

        records: records,

        error: null,
      );

    } catch (e) {

      print(e);

      String message =
          e.toString();

      if (e is DioException) {

        final data =
            e.response?.data;

        if (data is Map<String, dynamic>) {

          message =
              data["detail"] ??
              e.message ??
              "Network error";

        } else {

          message =
              data.toString();
        }
      }

      state = state.copyWith(

        isLoading: false,

        error: message,
      );
    }
  }
}